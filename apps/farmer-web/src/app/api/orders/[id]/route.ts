import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, customer: true, delivery: true },
    });
    if (!order) return jsonError("Order not found", 404);
    return jsonResponse(order);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    const order = await prisma.order.update({ where: { id }, data: { status }, include: { items: true } });
    return jsonResponse(order);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    return jsonResponse({ message: "Deleted" });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
