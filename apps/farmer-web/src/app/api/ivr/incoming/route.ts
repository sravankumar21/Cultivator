// IVR incoming call handler — Twilio calls this when someone dials our number
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ivrWelcomeTwiML } from "@cultivator/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string || "";
    const to = formData.get("To") as string || "";
    const callSid = formData.get("CallSid") as string || "";

    // Log the inbound call
    await prisma.call.create({
      data: {
        dealerId: "system",
        farmerPhone: from,
        status: "in_progress",
        duration: 0,
        notes: `IVR inbound from ${from} to ${to}`,
      },
    });

    // Return TwiML welcome menu
    return new Response(ivrWelcomeTwiML(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (e: any) {
    return new Response(
      `<Response><Say>Sorry, an error occurred. Goodbye.</Say><Hangup /></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }
}
