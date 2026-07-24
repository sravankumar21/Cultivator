// IVR outbound call status callback
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callSid = formData.get("CallSid") as string || "";
    const callStatus = formData.get("CallStatus") as string || "";
    const duration = parseInt(formData.get("CallDuration") as string || "0");
    const recordingUrl = formData.get("RecordingUrl") as string || "";

    // Update the call record if we can find it by twilioSid
    // For now, just log the status
    console.log(`[Twilio Status] ${callSid}: ${callStatus} (${duration}s)`);

    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 200 });
  }
}
