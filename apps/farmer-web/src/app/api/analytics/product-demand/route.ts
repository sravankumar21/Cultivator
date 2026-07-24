import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, category: true, brand: true, _count: { select: { orderItems: true } } },
    });
    const sorted = products.map((p: any) => ({ ...p, demand: p._count.orderItems })).sort((a: any, b: any) => b.demand - a.demand).slice(0, 10);
    return jsonResponse(sorted);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
