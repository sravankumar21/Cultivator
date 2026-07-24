// Delivery proof — photo/signature capture on delivery completion
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";

// POST — submit delivery proof
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { id: deliveryId } = await params;
    const { imageUrl, signature, notes, capturedBy } = await req.json();

    if (!imageUrl) return jsonError("imageUrl is required");

    // Check delivery exists and is delivered
    const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });
    if (!delivery) return jsonError("Delivery not found", 404);

    // Save proof
    const proof = await prisma.deliveryProof.create({
      data: {
        deliveryId,
        imageUrl,
        signature: signature || null,
        notes: notes || null,
        capturedBy: capturedBy || null,
      },
    });

    return jsonResponse(proof, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

// GET — fetch delivery proof
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: deliveryId } = await params;
    const proof = await prisma.deliveryProof.findUnique({ where: { deliveryId } });
    if (!proof) return jsonError("No proof found", 404);
    return jsonResponse(proof);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
