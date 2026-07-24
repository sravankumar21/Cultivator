// Save FCM push token for browser notifications
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, userId, role } = await req.json();
    if (!token || !userId || !role) return jsonError("token, userId, and role are required");

    // Upsert — same token might be re-registered
    await prisma.pushToken.upsert({
      where: { token },
      update: { userId, role, active: true },
      create: { token, userId, role },
    });

    return jsonResponse({ saved: true });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

// Deactivate token on logout
export async function DELETE(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return jsonError("token is required");

    await prisma.pushToken.updateMany({
      where: { token },
      data: { active: false },
    });

    return jsonResponse({ deactivated: true });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
