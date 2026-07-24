import { NextRequest } from "next/server";
import { getSession, jsonError, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return jsonError("Not authenticated", 401);
  return jsonResponse({ message: "Logged out successfully" });
}
