import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

function transformDealer(d: any) {
  return {
    ...d,
    location: { lat: d.locationLat, lng: d.locationLng },
    address: {
      village: d.addressVillage,
      mandal: d.addressMandal,
      district: d.addressDistrict,
      state: d.addressState,
      pincode: d.addressPincode,
      full: d.addressFull,
    },
    products: d.inventory?.map((i: any) => i.product?.category).filter(Boolean) ?? [],
    delivery: {
      available: d.deliveryAvailable,
      vehicles: d.deliveryVehicles ? JSON.parse(d.deliveryVehicles) : [],
      fee: d.deliveryFee,
      freeAbove: d.deliveryFreeAbove,
    },
    operatingHours: { open: d.operatingHoursOpen, close: d.operatingHoursClose },
  };
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");
    const enterpriseId = searchParams.get("enterpriseId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (enterpriseId) where.enterpriseId = enterpriseId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameTe: { contains: search } },
        { addressVillage: { contains: search, mode: "insensitive" } },
        { addressDistrict: { contains: search, mode: "insensitive" } },
      ];
    }

    const dealers = await prisma.dealer.findMany({
      where,
      include: { inventory: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxRadius = radius ? parseFloat(radius) : 50;

      const withDistance = dealers
        .map((d: any) => ({ ...d, distance: haversine(userLat, userLng, d.locationLat, d.locationLng) }))
        .filter((d: any) => d.distance <= maxRadius)
        .sort((a: any, b: any) => a.distance - b.distance);

      return jsonResponse(withDistance.map(transformDealer));
    }

    return jsonResponse(dealers.map(transformDealer));
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dealer = await prisma.dealer.create({ data: body });
    return jsonResponse(dealer, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
