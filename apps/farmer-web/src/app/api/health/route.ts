import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
