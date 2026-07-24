import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";
import { sendWhatsAppMessage, deliveryUpdateMessage } from "@cultivator/utils";
import { sendPushToDealer } from "@/lib/push-server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { id } = await params;
    const { status } = await req.json();

    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status, ...(status === "delivered" ? { deliveredAt: new Date() } : {}) },
      include: { order: true, customer: true },
    });

    if (status === "delivered") {
      await prisma.order.update({ where: { id: delivery.orderId }, data: { status: "delivered" } });
    }

    // Send WhatsApp delivery update + create in-app notification
    try {
      if (delivery.customer) {
        const dealer = await prisma.dealer.findUnique({ where: { id: delivery.dealerId } });
        const message = deliveryUpdateMessage({
          id: delivery.id,
          status,
          customerName: delivery.customer.name || "Customer",
          driverName: delivery.driverName || undefined,
          dealerName: dealer?.name || "Dealer",
        });

        await sendWhatsAppMessage({ to: delivery.customer.phone, body: message });

        // Send browser push to dealer
        await sendPushToDealer(
          delivery.dealerId,
          `Delivery ${status.replace("_", " ")}`,
          `Order #${delivery.id.slice(-6)} — ${delivery.customer.name || "Customer"}`,
          "/dealer/deliveries"
        );

        await prisma.notification.create({
          data: {
            dealerId: delivery.dealerId,
            type: "delivery_update",
            channel: "whatsapp",
            title: `Delivery #${delivery.id.slice(-6)} ${status.replace("_", " ")}`,
            body: `${delivery.customer.name} - ${status.replace("_", " ")}`,
            phone: delivery.customer.phone,
            sent: true,
            sentAt: new Date(),
            metadata: JSON.stringify({ deliveryId: delivery.id, orderId: delivery.orderId, status }),
          },
        });
      }
    } catch (notifErr) {
      console.error("Delivery notification error:", notifErr);
    }

    return jsonResponse(delivery);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}
