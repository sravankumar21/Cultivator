// IVR dealer route — finds nearest available dealer for call routing
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ivrRouteToDealerTwiML } from "@cultivator/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string || "";

    // Find active dealers sorted by most orders (proxy for availability)
    const dealers = await prisma.dealer.findMany({
      where: { status: "active" },
      orderBy: { totalOrders: "desc" },
      take: 10,
    });

    if (dealers.length === 0) {
      return new Response(
        `<Response><Say language="te-IN" voice="Polly.Aditi">Sorry, no dealers are available. Please try again later. Goodbye.</Say><Hangup /></Response>`,
        { headers: { "Content-Type": "text/xml" } }
      );
    }

    // In production: use farmer's location to find nearest dealer
    // For now: pick the dealer with most orders (most active)
    const dealer = dealers[0];

    const twiml = ivrRouteToDealerTwiML(dealer.phone, dealer.name);

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch {
    return new Response(
      `<Response><Say>Sorry, an error occurred. Goodbye.</Say><Hangup /></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  }
}
