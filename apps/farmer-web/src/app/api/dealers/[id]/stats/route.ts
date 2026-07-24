import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dealerId = id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, totalCustomers, totalCalls, todayCalls, missedCalls, pendingOrders] =
      await Promise.all([
        prisma.order.count({ where: { dealerId } }),
        prisma.customer.count({ where: { dealerId } }),
        prisma.call.count({ where: { dealerId } }),
        prisma.call.count({ where: { dealerId, createdAt: { gte: today } } }),
        prisma.call.count({ where: { dealerId, status: "missed", createdAt: { gte: today } } }),
        prisma.order.count({ where: { dealerId, status: { in: ["new", "confirmed"] } } }),
      ]);

    return jsonResponse({ totalOrders, totalCustomers, totalCalls, todayCalls, missedCalls, pendingOrders });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
