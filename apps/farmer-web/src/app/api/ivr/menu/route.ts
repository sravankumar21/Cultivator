// IVR menu handler — processes DTMF digit selection
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ivrRouteToDealerTwiML, ivrOrderStatusTwiML, ivrProductInfoTwiML } from "@cultivator/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const digits = formData.get("Digits") as string || "";
    const from = formData.get("From") as string || "";
    const callSid = formData.get("CallSid") as string || "";

    let twiml = "";

    switch (digits) {
      case "1": {
        // Route to nearest dealer
        const dealers = await prisma.dealer.findMany({
          where: { status: "active" },
          orderBy: { totalOrders: "desc" },
          take: 5,
        });

        if (dealers.length > 0) {
          const dealer = dealers[0]; // In production, use geolocation-based routing
          twiml = ivrRouteToDealerTwiML(dealer.phone, dealer.name);

          // Update call log
          await prisma.call.create({
            data: {
              dealerId: dealer.id,
              farmerPhone: from,
              status: "connected",
              duration: 0,
              notes: `IVR → Dealer: ${dealer.name} (${dealer.phone})`,
            },
          });
        } else {
          twiml = `<Response><Say language="te-IN" voice="Polly.Aditi">Sorry, no dealers are available right now. Goodbye.</Say><Hangup /></Response>`;
        }
        break;
      }
      case "2": {
        // Order status
        twiml = ivrOrderStatusTwiML();
        break;
      }
      case "3": {
        // Product info
        twiml = ivrProductInfoTwiML();
        break;
      }
      case "9": {
        // Repeat menu
        const { ivrWelcomeTwiML } = await import("@cultivator/utils");
        twiml = ivrWelcomeTwiML();
        break;
      }
      default: {
        twiml = `<Response><Say language="te-IN" voice="Polly.Aditi">Invalid option. Goodbye.</Say><Hangup /></Response>`;
      }
    }

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (e: any) {
    return new Response(
      `<Response><Say>Sorry, an error occurred. Goodbye.</Say><Hangup /></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }
}
