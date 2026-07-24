import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: any = {};
    if (dealerId) where.dealerId = dealerId;
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

    return jsonResponse(orders);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { dealerId, customerId, items, notes, deliveryRequired, deliveryAddress } = await req.json();

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
    return jsonResponse(order, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
