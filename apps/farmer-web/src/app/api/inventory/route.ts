import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const lowStock = searchParams.get("lowStock");

    const where: any = {};
    // Dealers can only see their own inventory
    if (session.role === "dealer") {
      where.dealerId = session.dealerId;
    } else if (dealerId) {
      where.dealerId = dealerId;
    }

    const inventory = await prisma.inventory.findMany({
      where, include: { product: true }, orderBy: { updatedAt: "desc" },
    });

    const result = lowStock === "true"
      ? inventory.filter((i: any) => i.quantity <= i.lowStockThreshold)
      : inventory;

    return jsonResponse(result);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const body = await req.json();
    const { productId, quantity, price, lowStockThreshold } = body;
    // Dealers can only manage their own inventory
    const dealerId = session.role === "dealer" ? session.dealerId : body.dealerId;

    const existing = await prisma.inventory.findFirst({ where: { dealerId, productId } });

    let item;
    if (existing) {
      item = await prisma.inventory.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 0), price: price || existing.price, lowStockThreshold: lowStockThreshold || existing.lowStockThreshold },
        include: { product: true },
      });
    } else {
      item = await prisma.inventory.create({
        data: { dealerId, productId, quantity: quantity || 0, price: price || 0, lowStockThreshold: lowStockThreshold || 10 },
        include: { product: true },
      });
    }

    return jsonResponse(item);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
