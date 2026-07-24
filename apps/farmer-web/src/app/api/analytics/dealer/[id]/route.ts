import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: dealerId } = await params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayCalls, missedCalls, pendingOrders, confirmedOrders, pendingDeliveries, todaySalesAgg, lowStock] =
      await Promise.all([
        prisma.call.count({ where: { dealerId, createdAt: { gte: today } } }),
        prisma.call.count({ where: { dealerId, status: "missed", createdAt: { gte: today } } }),
        prisma.order.count({ where: { dealerId, status: { in: ["new", "confirmed"] } } }),
        prisma.order.count({ where: { dealerId, status: "confirmed" } }),
        prisma.delivery.count({ where: { dealerId, status: { not: "delivered" } } }),
        prisma.order.aggregate({ where: { dealerId, createdAt: { gte: today } }, _sum: { total: true } }),
        prisma.inventory.count({ where: { dealerId, quantity: { lte: 10 } } }),
      ]);

    return jsonResponse({
      todayCalls, missedCalls, pendingOrders, confirmedOrders, pendingDeliveries,
      todaySales: todaySalesAgg._sum.total || 0, lowStockProducts: lowStock,
    });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
