import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status, ...(status === "delivered" ? { deliveredAt: new Date() } : {}) },
      include: { order: true, customer: true },
    });

    if (status === "delivered") {
      await prisma.order.update({ where: { id: delivery.orderId }, data: { status: "delivered" } });
    }

    return jsonResponse(delivery);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
