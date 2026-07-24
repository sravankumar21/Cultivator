// IVR dial status callback — Twilio calls this after dial attempt
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const dialStatus = formData.get("DialCallStatus") as string || "";
    const dialCallDuration = formData.get("DialCallDuration") as string || "0";

    let twiml = "";

    switch (dialStatus) {
      case "completed":
        twiml = `<Response><Hangup /></Response>`;
        break;
      case "no-answer":
      case "busy":
      case "failed": {
        const { ivrWelcomeTwiML } = await import("@cultivator/utils");
        twiml = ivrWelcomeTwiML();
        break;
      }
      default:
        twiml = `<Response><Hangup /></Response>`;
    }

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch {
    return new Response(
      `<Response><Hangup /></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }
}
