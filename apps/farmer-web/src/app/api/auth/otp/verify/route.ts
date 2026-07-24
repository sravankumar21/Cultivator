import { NextRequest } from "next/server";
import { verifyOTP, signToken, jsonError, jsonResponse } from "@/lib/auth";

// In-memory user store for demo
const farmers: Record<string, { id: string; phone: string; name: string; role: string }> = {};

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) return jsonError("Phone and OTP are required");

    const isValid = verifyOTP(phone, otp);
    if (!isValid) return jsonError("Invalid or expired OTP", 401);

    if (!farmers[phone]) {
      farmers[phone] = {
        id: `user-farmer-${Date.now()}`,
        phone,
        name: `Farmer ${phone.slice(-4)}`,
        role: "farmer",
      };
    }

    const farmer = farmers[phone];
    const token = await signToken({
      userId: farmer.id,
      phone: farmer.phone,
      name: farmer.name,
      role: farmer.role,
    });

    return jsonResponse({
      token,
      user: { id: farmer.id, name: farmer.name, phone: farmer.phone, role: farmer.role },
    });
  } catch {
    return jsonError("Verification failed", 500);
  }
}
