import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";
import { maskPhone } from "@cultivator/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const status = searchParams.get("status");

    const where: any = {};
    // Dealers can only see their own deliveries
    if (session.role === "dealer") {
      where.dealerId = session.dealerId;
    } else if (dealerId) {
      where.dealerId = dealerId;
    }
    if (status) where.status = status;

    const deliveries = await prisma.delivery.findMany({
      where, include: { order: true, customer: true }, orderBy: { createdAt: "desc" },
    });

    const masked = deliveries.map((d: any) => {
      const isOwner = session.role === "admin" || session.dealerId === d.dealerId;
      if (isOwner || !d.customer) return d;
      return { ...d, customer: { ...d.customer, phone: maskPhone(d.customer.phone) } };
    });

    return jsonResponse(masked);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { orderId, vehicle, driverName, driverPhone, deliveryAddress, deliveryFee, scheduledAt } = await req.json();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return jsonError("Order not found", 404);

    // Dealers can only create deliveries for their own orders
    if (session.role === "dealer" && order.dealerId !== session.dealerId) {
      return jsonError("Forbidden", 403);
    }

    const delivery = await prisma.delivery.create({
      data: {
        dealerId: order.dealerId, orderId, customerId: order.customerId,
        vehicle, driverName, driverPhone,
        deliveryAddress: deliveryAddress || order.deliveryAddress || "",
        deliveryFee: deliveryFee || 0, status: "delivery_assigned",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: { order: true, customer: true },
    });

    await prisma.order.update({ where: { id: orderId }, data: { status: "delivery_assigned" } });
    return jsonResponse(delivery, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}


