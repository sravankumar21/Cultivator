// Send browser push notifications to dealer/admin
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);

    const { title, body, url, userIds, role } = await req.json();
    if (!title || !body) return jsonError("title and body are required");

    const where: any = { active: true };
    if (userIds && userIds.length > 0) where.userId = { in: userIds };
    if (role) where.role = role;

    const tokens = await prisma.pushToken.findMany({ where, select: { token: true } });

    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log(`[Push Demo] ${title}: ${body} (to ${tokens.length} devices)`);
      return jsonResponse({ sent: 0, total: tokens.length, demo: true });
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = require("firebase-admin");
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)) });
    }

    let sent = 0;
    for (const { token } of tokens) {
      try {
        await admin.messaging().send({ token, notification: { title, body }, data: { url: url || "/" } });
        sent++;
      } catch {
        await prisma.pushToken.updateMany({ where: { token }, data: { active: false } });
      }
    }

    return jsonResponse({ sent, total: tokens.length });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
