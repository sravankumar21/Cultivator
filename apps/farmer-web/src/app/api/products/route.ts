import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const enterpriseId = searchParams.get("enterpriseId");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};
    if (enterpriseId) where.enterpriseId = enterpriseId;
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameTe: { contains: search } },
        { brand: { contains: search, mode: "insensitive" } },
        { brandTe: { contains: search } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse(products);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, "admin", "dealer");
    if (!session) return jsonError("Forbidden", 403);
    const body = await req.json();
    const product = await prisma.product.create({ data: body });
    return jsonResponse(product, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
