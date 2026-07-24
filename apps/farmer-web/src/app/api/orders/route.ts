import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth, requireRole } from "@/lib/auth";
import { maskPhone, sendWhatsAppMessage, orderConfirmationMessage, formatCurrency } from "@cultivator/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: any = {};
    // Dealers can only see their own orders
    if (session.role === "dealer") {
      where.dealerId = session.dealerId;
    } else if (dealerId) {
      where.dealerId = dealerId;
    }
    if (status) where.status = status;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } }, customer: true, delivery: true },
      orderBy: { createdAt: "desc" },
    });

    // Mask customer phone for non-owner access
    const masked = orders.map((o: any) => {
      const isOwner = session.role === "admin" || session.dealerId === o.dealerId;
      if (isOwner || !o.customer) return o;
      return { ...o, customer: { ...o.customer, phone: maskPhone(o.customer.phone) } };
    });

    return jsonResponse(masked);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, "dealer", "admin");
    if (!session) return jsonError("Forbidden", 403);
    const body = await req.json();
    const { customerId, items, notes, deliveryRequired, deliveryAddress } = body;
    // Dealers can only create orders for themselves
    const dealerId = session.role === "dealer" ? session.dealerId : body.dealerId;

    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const total = item.quantity * item.unitPrice;
      subtotal += total;
      return { productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, total };
    });

    const order = await prisma.order.create({
      data: {
        dealerId, customerId, subtotal, tax: 0, total: subtotal,
        notes, deliveryRequired: deliveryRequired || false, deliveryAddress, status: "new",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    await prisma.dealer.update({ where: { id: dealerId }, data: { totalOrders: { increment: 1 } } });

    // Send WhatsApp notification + create in-app notification
    try {
      const customer = await prisma.customer.findUnique({ where: { id: customerId } });
      const dealer = await prisma.dealer.findUnique({ where: { id: dealerId } });
      const products = await prisma.product.findMany({ where: { id: { in: items.map((i: any) => i.productId) } } });

      if (customer && dealer) {
        const itemList = items.map((item: any) => {
          const prod = products.find((p: any) => p.id === item.productId);
          return { name: prod?.name || "Product", quantity: item.quantity, price: item.unitPrice };
        });

        const message = orderConfirmationMessage({
          id: order.id,
          customerName: customer.name || "Customer",
          items: itemList,
          total: subtotal,
          dealerName: dealer.name,
          dealerPhone: dealer.phone,
        });

        // Send WhatsApp (will log in demo mode)
        await sendWhatsAppMessage({ to: customer.phone, body: message });

        // Create in-app notification for dealer
        await prisma.notification.create({
          data: {
            dealerId,
            type: "order_confirmed",
            channel: "whatsapp",
            title: `New order #${order.id.slice(-6)}`,
            body: `Order from ${customer.name} for ${formatCurrency(subtotal)}`,
            phone: customer.phone,
            sent: true,
            sentAt: new Date(),
            metadata: JSON.stringify({ orderId: order.id, customerId }),
          },
        });
      }
    } catch (notifErr) {
      // Don't fail the order if notification fails
      console.error("Notification error:", notifErr);
    }

    return jsonResponse(order, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
