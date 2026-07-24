// Enterprise settings — GET / PATCH
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth, requireRole } from "@/lib/auth";

const DEFAULT_ENTERPRISE_ID = "ent-001";

// GET — fetch enterprise settings
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);

    const enterprise = await prisma.enterprise.findUnique({
      where: { id: DEFAULT_ENTERPRISE_ID },
      select: {
        id: true, name: true, phone: true, email: true,
        logo: true, address: true, status: true,
        createdAt: true, updatedAt: true,
      },
    });

    if (!enterprise) return jsonError("Enterprise not found", 404);
    return jsonResponse(enterprise);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

// PATCH — update enterprise settings (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole(req, "admin");
    if (!session) return jsonError("Unauthorized — admin only", 401);

    const body = await req.json();
    const { companyName, phone, email, address, logo } = body;

    const enterprise = await prisma.enterprise.update({
      where: { id: DEFAULT_ENTERPRISE_ID },
      data: {
        ...(companyName !== undefined && { name: companyName }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(logo !== undefined && { logo }),
      },
      select: {
        id: true, name: true, phone: true, email: true,
        logo: true, address: true, status: true,
      },
    });

    return jsonResponse(enterprise);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
