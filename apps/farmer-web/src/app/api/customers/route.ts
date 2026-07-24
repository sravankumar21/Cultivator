import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const search = searchParams.get("search");

    const where: any = {};
    if (dealerId) where.dealerId = dealerId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { village: { contains: search, mode: "insensitive" } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where, include: { farmer: true }, orderBy: { updatedAt: "desc" },
    });
    return jsonResponse(customers);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { phone, name, dealerId, village, address } = await req.json();

    let farmer = await prisma.farmer.findUnique({ where: { phone } });
    if (!farmer) farmer = await prisma.farmer.create({ data: { phone, name, village } });

    const existing = await prisma.customer.findFirst({ where: { dealerId, farmerId: farmer.id } });
    if (existing) return jsonResponse(existing);

    const customer = await prisma.customer.create({
      data: { dealerId, farmerId: farmer.id, name: name || farmer.name || "Unknown", phone, village, address },
    });
    await prisma.dealer.update({ where: { id: dealerId }, data: { totalCustomers: { increment: 1 } } });
    return jsonResponse(customer, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
