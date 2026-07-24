// Check if farmer exists and whether PIN is set
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) return jsonError("Phone number is required");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return jsonError("Invalid phone number — must be 10 digits");

    const farmer = await prisma.farmer.findUnique({ where: { phone: cleanPhone } });

    if (!farmer) {
      // New farmer — needs to set PIN
      return jsonResponse({ exists: false, hasPin: false, phone: cleanPhone });
    }

    const hasPin = !!farmer.pinHash;

    return jsonResponse({
      exists: true,
      hasPin,
      phone: cleanPhone,
      name: farmer.name || null,
    });
  } catch {
    return jsonError("Failed to check phone", 500);
  }
}
