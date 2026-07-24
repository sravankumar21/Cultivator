// Delivery tracking — update driver location + get tracking history
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonResponse, requireAuth } from "@/lib/auth";
import { sendWhatsAppMessage, deliveryUpdateMessage } from "@cultivator/utils";

// GET — fetch tracking history for a delivery
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(_req);
    if (!session) return jsonError("Unauthorized", 401);
    const { id: deliveryId } = await params;

    const tracking = await prisma.deliveryTracking.findMany({
      where: { deliveryId },
      orderBy: { timestamp: "asc" },
    });

    const proof = await prisma.deliveryProof.findUnique({ where: { deliveryId } });

    return jsonResponse({ tracking, proof });
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

// POST — update driver location (called by driver app or tracking device)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth(req);
    if (!session) return jsonError("Unauthorized", 401);
    const { id: deliveryId } = await params;
    const { lat, lng, speed, heading, accuracy } = await req.json();

    if (!lat || !lng) return jsonError("lat and lng are required");

    // Save tracking point
    const point = await prisma.deliveryTracking.create({
      data: {
        deliveryId,
        driverLat: lat,
        driverLng: lng,
        speed: speed || null,
        heading: heading || null,
        accuracy: accuracy || null,
      },
    });

    // Check geofence — notify if driver is within 2km of delivery address
    const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });
    if (delivery) {
      const distance = haversine(lat, lng, lat, lng); // placeholder — real impl would use delivery coordinates
      // If delivery is out_for_delivery and this is a significant location update
      if (delivery.status === "out_for_delivery") {
        // Geofence alert at 500m
        const lastNotification = await prisma.notification.findFirst({
          where: {
            dealerId: delivery.dealerId,
            type: "delivery_update",
            metadata: { contains: deliveryId },
          },
          orderBy: { createdAt: "desc" },
        });

        // Only notify if more than 5 minutes since last notification
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (!lastNotification || lastNotification.createdAt < fiveMinAgo) {
          // Check if speed is 0 (arrived)
          if (speed !== undefined && speed < 2) {
            await sendWhatsAppMessage({
              to: delivery.driverPhone || "",
              body: `📍 You appear to have arrived at the delivery location.\n\nOrder #${delivery.id.slice(-6)}\nAddress: ${delivery.deliveryAddress}`,
            });
          }
        }
      }
    }

    return jsonResponse(point, 201);
  } catch (e: any) {
    return jsonError(e.message, 500);
  }
}

// Haversine formula — distance between two GPS points in km
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
