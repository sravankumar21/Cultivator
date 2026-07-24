import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

function transformDealer(d: any) {
  return {
    ...d,
    location: { lat: d.locationLat, lng: d.locationLng },
    address: {
      village: d.addressVillage, mandal: d.addressMandal, district: d.addressDistrict,
      state: d.addressState, pincode: d.addressPincode, full: d.addressFull,
    },
    products: d.inventory?.map((i: any) => i.product?.category).filter(Boolean) ?? [],
    delivery: {
      available: d.deliveryAvailable,
      vehicles: d.deliveryVehicles ? JSON.parse(d.deliveryVehicles) : [],
      fee: d.deliveryFee, freeAbove: d.deliveryFreeAbove,
    },
    operatingHours: { open: d.operatingHoursOpen, close: d.operatingHoursClose },
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const dealer = await prisma.dealer.findUnique({
      where: { id },
      include: {
        inventory: { include: { product: true } },
        products: { include: { product: true } },
        _count: { select: { customers: true, orders: true, calls: true } },
      },
    });
    if (!dealer) return jsonError("Dealer not found", 404);
    return jsonResponse(transformDealer(dealer));
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const dealer = await prisma.dealer.update({ where: { id }, data: body });
    return jsonResponse(dealer);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.dealer.delete({ where: { id } });
    return jsonResponse({ message: "Deleted" });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
