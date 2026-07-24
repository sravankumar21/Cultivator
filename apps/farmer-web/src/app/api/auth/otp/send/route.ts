import { NextRequest } from "next/server";
import { generateOTP, storeOTP, sendOTPSms, jsonError, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) return jsonError("Phone number is required");

    // Validate phone format (10 digits)
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return jsonError("Invalid phone number — must be 10 digits");

    const otp = generateOTP();
    await storeOTP(cleanPhone, otp);

    // Try to send SMS via Twilio
    const smsSent = await sendOTPSms(cleanPhone, otp);

    return jsonResponse({
      message: smsSent ? "OTP sent via SMS" : "OTP generated (SMS not configured)",
      // In development without Twilio, return OTP so user can test
      _dev_otp: !smsSent ? otp : undefined,
    });
  } catch {
    return jsonError("Failed to send OTP", 500);
  }
}
