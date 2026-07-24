import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";
import { maskPhone } from "@cultivator/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const search = searchParams.get("search");

    const where: any = {};
    // Dealers can only see their own customers
    if (session.role === "dealer") {
      where.dealerId = session.dealerId;
    } else if (dealerId) {
      where.dealerId = dealerId;
    }
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

    // Mask phone numbers for non-owner access
    const masked = customers.map((c: any) => {
      const isOwner = session.role === "admin" || session.dealerId === c.dealerId;
      return { ...c, phone: isOwner ? c.phone : maskPhone(c.phone) };
    });

    return jsonResponse(masked);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const body = await req.json();
    const { phone, name, village, address } = body;
    // Dealers can only add customers to themselves
    const dealerId = session.role === "dealer" ? session.dealerId : body.dealerId;

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
