import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, "admin");
    if (!session) return jsonError("Forbidden", 403);
    const dealers = await prisma.dealer.findMany({
      where: { status: "active" },
      orderBy: { totalOrders: "desc" },
      take: 10,
      select: { id: true, name: true, addressVillage: true, addressDistrict: true, totalOrders: true, totalCustomers: true, rating: true },
    });
    return jsonResponse(dealers);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
