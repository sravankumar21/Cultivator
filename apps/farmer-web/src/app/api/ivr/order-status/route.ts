// IVR order status lookup — processes 6-digit order number input
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const digits = formData.get("Digits") as string || "";

    const order = await prisma.order.findFirst({
      where: { id: { endsWith: digits } },
      include: { items: true },
    });

    let twiml = "";

    if (order) {
      const statusMap: Record<string, string> = {
        new: "Your order has been received and is being processed.",
        confirmed: "Your order has been confirmed and is being prepared.",
        processing: "Your order is being prepared.",
        ready: "Your order is ready for pickup.",
        delivery_assigned: "Your order has been assigned for delivery.",
        out_for_delivery: "Your order is on the way to you!",
        delivered: "Your order has been delivered. Thank you!",
        cancelled: "Your order has been cancelled.",
      };

      const statusText = statusMap[order.status] || `Your order status is: ${order.status}`;
      const total = order.total;

      twiml = `
        <Response>
          <Say language="te-IN" voice="Polly.Aditi">
            Order ${digits}: ${statusText} Your total was Rs. ${total}. Thank you for using Cultivator.
          </Say>
          <Gather numDigits="1" action="/api/ivr/menu" method="POST" timeout="5">
            <Say>Press 1 to speak with a dealer, or press any other key to hang up.</Say>
          </Gather>
          <Hangup />
        </Response>
      `.trim();
    } else {
      twiml = `
        <Response>
          <Say language="te-IN" voice="Polly.Aditi">
            Sorry, we could not find an order with that number. Please try again.
          </Say>
          <Redirect>/api/ivr/order-lookup</Redirect>
        </Response>
      `.trim();
    }

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
