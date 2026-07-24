// IVR missed call handler — logs missed calls and sends callback
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@cultivator/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string || "";
    const to = formData.get("To") as string || "";
    const callSid = formData.get("CallSid") as string || "";
    const callStatus = formData.get("CallStatus") as string || "";
    const duration = parseInt(formData.get("CallDuration") as string || "0");

    // Find which dealer this number belongs to
    const dealer = await prisma.dealer.findFirst({
      where: { phone: to },
    });

    if (dealer) {
      // Log the missed call
      await prisma.call.create({
        data: {
          dealerId: dealer.id,
          farmerPhone: from,
          status: callStatus === "completed" ? "completed" : "missed",
          duration: duration || 0,
          notes: `Call ${callStatus} — ${from}`,
        },
      });

      await prisma.dealer.update({
        where: { id: dealer.id },
        data: { totalCalls: { increment: 1 } },
      });

      // If missed, send WhatsApp notification to dealer
      if (callStatus !== "completed" && duration < 5) {
        await sendWhatsAppMessage({
          to: dealer.phone,
          body: `📞 Missed call from ${from}\n\nA farmer tried to reach you on Cultivator. Please call them back at ${from}.`,
        });

        await prisma.notification.create({
          data: {
            dealerId: dealer.id,
            type: "general",
            channel: "whatsapp",
            title: "Missed call",
            body: `Missed call from ${from}`,
            phone: from,
            sent: true,
            sentAt: new Date(),
          },
        });
      }
    }

    // Return empty response — call is over
    return new Response(null, { status: 200 });
  } catch (e: any) {
    return new Response(null, { status: 200 });
  }
}
