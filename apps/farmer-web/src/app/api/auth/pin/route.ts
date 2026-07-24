// PIN login — verify phone + PIN, or set PIN for new farmer
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPin, verifyPin, signToken, jsonError, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone, pin, name, village, action } = await req.json();
    if (!phone || !pin) return jsonError("Phone and PIN are required");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return jsonError("Invalid phone number");
    if (!/^\d{4}$/.test(pin)) return jsonError("PIN must be 4 digits");

    const farmer = await prisma.farmer.findUnique({ where: { phone: cleanPhone } });

    if (action === "setup") {
      // Setting PIN for first time
      if (farmer && farmer.pinHash) {
        return jsonError("PIN already set. Use login action.");
      }

      const pinHash = await hashPin(pin);

      if (farmer) {
        // Farmer exists but no PIN — update
        await prisma.farmer.update({
          where: { id: farmer.id },
          data: {
            pinHash,
            ...(name && { name }),
            ...(village && { village }),
          },
        });
      } else {
        // New farmer — create with PIN
        await prisma.farmer.create({
          data: {
            phone: cleanPhone,
            pinHash,
            name: name || `Farmer ${cleanPhone.slice(-4)}`,
            ...(village && { village }),
          },
        });
      }

      const updatedFarmer = await prisma.farmer.findUnique({ where: { phone: cleanPhone } });
      if (!updatedFarmer) return jsonError("Failed to create farmer", 500);

      const token = await signToken({
        userId: updatedFarmer.id,
        phone: updatedFarmer.phone,
        name: updatedFarmer.name || `Farmer ${cleanPhone.slice(-4)}`,
        role: "farmer",
      });

      return jsonResponse({
        token,
        user: {
          id: updatedFarmer.id,
          name: updatedFarmer.name || `Farmer ${cleanPhone.slice(-4)}`,
          phone: updatedFarmer.phone,
          role: "farmer",
          isNewFarmer: true,
        },
      });
    }

    // Default action: login
    if (!farmer) return jsonError("Account not found. Please set up your PIN first.", 404);
    if (!farmer.pinHash) return jsonError("PIN not set. Please set up your PIN first.");

    const valid = await verifyPin(pin, farmer.pinHash);
    if (!valid) return jsonError("Incorrect PIN", 401);

    const token = await signToken({
      userId: farmer.id,
      phone: farmer.phone,
      name: farmer.name || `Farmer ${cleanPhone.slice(-4)}`,
      role: "farmer",
    });

    return jsonResponse({
      token,
      user: {
        id: farmer.id,
        name: farmer.name || `Farmer ${cleanPhone.slice(-4)}`,
        phone: farmer.phone,
        role: "farmer",
        isNewFarmer: false,
      },
    });
  } catch (e: any) {
    return jsonError(e.message || "Login failed", 500);
  }
}
