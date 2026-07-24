import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const call = await prisma.call.update({ where: { id }, data: body });
    return jsonResponse(call);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
