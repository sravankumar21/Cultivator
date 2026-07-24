import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const dealerId = searchParams.get("dealerId");
    const status = searchParams.get("status");

    const where: any = {};
    if (dealerId) where.dealerId = dealerId;
    if (status) where.status = status;

    const calls = await prisma.call.findMany({ where, orderBy: { createdAt: "desc" } });
    return jsonResponse(calls);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Smart call routing
    if (body.farmerLat && body.farmerLng) {
      const dealers = await prisma.dealer.findMany({ where: { status: "active" }, include: { inventory: true } });
      const withDistance = dealers
        .map((d: any) => ({ ...d, distance: haversine(body.farmerLat, body.farmerLng, d.locationLat, d.locationLng) }))
        .filter((d: any) => d.distance <= (d.serviceRadius || 10))
        .sort((a: any, b: any) => a.distance - b.distance);

      if (withDistance.length === 0) {
        return jsonResponse({ dealerId: null, message: "No dealers found in your area" });
      }

      const nearest = withDistance[0];
      return jsonResponse({
        dealerId: nearest.id, dealerName: nearest.name, phone: nearest.phone,
        distance: Math.round(nearest.distance * 10) / 10,
      });
    }

    const call = await prisma.call.create({ data: body });
    await prisma.dealer.update({ where: { id: body.dealerId }, data: { totalCalls: { increment: 1 } } });
    return jsonResponse(call, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}


