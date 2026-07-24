import { NextRequest } from "next/server";
import { signToken, jsonError, jsonResponse, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, name, village } = await req.json();
    if (!phone || !name) return jsonError("Phone and name are required");

    const farmer = await prisma.farmer.findUnique({ where: { phone } });
    if (!farmer) return jsonError("Farmer not found. Please verify OTP first.", 404);

    const updated = await prisma.farmer.update({
      where: { phone },
      data: {
        name: name.trim(),
        village: village?.trim() || undefined,
      },
    });

    const token = await signToken({
      userId: updated.id,
      phone: updated.phone,
      name: updated.name || `Farmer ${phone.slice(-4)}`,
      role: "farmer",
    });

    return jsonResponse({
      token,
      user: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        role: "farmer",
        isNewFarmer: false,
      },
    });
  } catch {
    return jsonError("Failed to complete profile", 500);
  }
}
