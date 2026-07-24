import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const where: any = {};
    // Dealers see their own notifications, admins see all
    if (session.role === "dealer") {
      where.dealerId = session.dealerId;
    }
    if (unreadOnly) {
      where.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return jsonResponse(notifications);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);

    const { ids, markAll } = await req.json();

    if (markAll) {
      const where: any = { read: false };
      if (session.role === "dealer") {
        where.dealerId = session.dealerId;
      }
      await prisma.notification.updateMany({
        where,
        data: { read: true, readAt: new Date() },
      });
      return jsonResponse({ message: "All notifications marked as read" });
    }

    if (ids && Array.isArray(ids)) {
      await prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { read: true, readAt: new Date() },
      });
      return jsonResponse({ message: "Notifications marked as read" });
    }

    return jsonError("Provide ids array or markAll: true");
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
