import { NextRequest } from "next/server";
import { generateOTP, storeOTP, jsonError, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) return jsonError("Phone number is required");

    const otp = generateOTP();
    storeOTP(phone, otp);

    console.log(`[OTP] Sending ${otp} to ${phone}`);

    return jsonResponse({
      message: "OTP sent successfully",
      _dev_otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch {
    return jsonError("Failed to send OTP", 500);
  }
}
