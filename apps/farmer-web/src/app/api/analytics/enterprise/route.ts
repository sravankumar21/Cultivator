import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, "admin");
    if (!session) return jsonError("Forbidden", 403);
    const { searchParams } = new URL(req.url);
    const enterpriseId = searchParams.get("enterpriseId");
    const where: any = {};
    if (enterpriseId) where.enterpriseId = enterpriseId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalDealers, activeDealers, totalFarmers, todayCalls, totalOrders, pendingDeliveries, todaySalesAgg] =
      await Promise.all([
        prisma.dealer.count({ where }),
        prisma.dealer.count({ where: { ...where, status: "active" } }),
        prisma.farmer.count(),
        prisma.call.count({ where: { createdAt: { gte: today } } }),
        prisma.order.count(),
        prisma.delivery.count({ where: { status: { not: "delivered" } } }),
        prisma.order.aggregate({ where: { createdAt: { gte: today } }, _sum: { total: true } }),
      ]);

    return jsonResponse({
      totalDealers, activeDealers, totalFarmers, todayCalls, totalOrders, pendingDeliveries,
      todaySales: todaySalesAgg._sum.total || 0,
    });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
