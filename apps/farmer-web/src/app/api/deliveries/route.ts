import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const status = searchParams.get("status");

    const where: any = {};
    if (dealerId) where.dealerId = dealerId;
    if (status) where.status = status;

    const deliveries = await prisma.delivery.findMany({
      where, include: { order: true, customer: true }, orderBy: { createdAt: "desc" },
    });
    return jsonResponse(deliveries);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, vehicle, driverName, driverPhone, deliveryAddress, deliveryFee, scheduledAt } = await req.json();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return jsonError("Order not found", 404);

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


