import { NextRequest } from "next/server";
import { verifyOTP, signToken, jsonError, jsonResponse } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) return jsonError("Phone and OTP are required");

    const isValid = await verifyOTP(phone, otp);
    if (!isValid) return jsonError("Invalid or expired OTP", 401);

    // Find or create farmer in MongoDB
    let farmer = await prisma.farmer.findUnique({ where: { phone } });
    let isNewFarmer = false;

    if (!farmer) {
      isNewFarmer = true;
      farmer = await prisma.farmer.create({
        data: {
          phone,
          name: `Farmer ${phone.slice(-4)}`,
        },
      });
    }

    const token = await signToken({
      userId: farmer.id,
      phone: farmer.phone,
      name: farmer.name || `Farmer ${phone.slice(-4)}`,
      role: "farmer",
    });

    return jsonResponse({
      token,
      user: {
        id: farmer.id,
        name: farmer.name || `Farmer ${phone.slice(-4)}`,
        phone: farmer.phone,
        role: "farmer",
        isNewFarmer,
      },
    });
  } catch {
    return jsonError("Verification failed", 500);
  }
}
