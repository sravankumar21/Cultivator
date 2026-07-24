import { NextRequest } from "next/server";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return jsonError("No file provided");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return jsonError("File must be an image");
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return jsonError("Image must be under 5MB");
    }

    // Convert to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    return jsonResponse({
      url: dataUri,
      type: file.type,
      size: file.size,
      name: file.name,
    });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
