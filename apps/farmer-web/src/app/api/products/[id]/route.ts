import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth, requireRole } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return jsonError("Product not found", 404);
    return jsonResponse(product);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { id } = await params;
    const body = await req.json();

    // Dealers can only update imageUrl and imageUploadedByDealer
    if (session.role === "dealer") {
      const allowed: Record<string, any> = {};
      if (body.imageUrl !== undefined) allowed.imageUrl = body.imageUrl;
      if (body.imageUploadedByDealer !== undefined) allowed.imageUploadedByDealer = body.imageUploadedByDealer;
      const product = await prisma.product.update({ where: { id }, data: allowed });
      return jsonResponse(product);
    }

    const product = await prisma.product.update({ where: { id }, data: body });
    return jsonResponse(product);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole(_req, "admin");
    if (!session) return jsonError("Forbidden", 403);
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return jsonResponse({ message: "Deleted" });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
