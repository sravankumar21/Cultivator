// WhatsApp Business API integration
// In production, replace with real WhatsApp Business API calls
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api

interface WhatsAppMessage {
  to: string;
  template?: string;
  body: string;
}

interface WhatsAppConfig {
  apiUrl: string;
  phoneNumberId: string;
  accessToken: string;
}

function getConfig(): WhatsAppConfig | null {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!apiUrl || !phoneNumberId || !accessToken) return null;
  return { apiUrl, phoneNumberId, accessToken };
}

export async function sendWhatsAppMessage(msg: WhatsAppMessage): Promise<{ success: boolean; id?: string; error?: string }> {
  const config = getConfig();

  // Demo mode: log message and return success
  if (!config) {
    console.log(`[WhatsApp Demo] To: ${msg.to}\n${msg.body}\n`);
    return { success: true, id: `demo-${Date.now()}` };
  }

  try {
    const res = await fetch(`${config.apiUrl}/${config.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: msg.to.replace(/\D/g, ""),
        type: "text",
        text: { body: msg.body },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error?.message || "Failed to send" };
    }
    return { success: true, id: data.messages?.[0]?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Pre-built message templates

export function orderConfirmationMessage(order: {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  dealerName: string;
  dealerPhone: string;
}): string {
  const itemLines = order.items.map(i => `  ${i.quantity}x ${i.name} - ₹${i.price}`).join("\n");
  return (
    `🚜 *Order Confirmed!*\n\n` +
    `Hi ${order.customerName},\n\n` +
    `Your order *#${order.id.slice(-6)}* with ${order.dealerName} has been confirmed.\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `*Total: ₹${order.total}*\n\n` +
    `📞 Dealer: ${order.dealerName} (${order.dealerPhone})\n\n` +
    `Thank you for shopping with Cultivator! 🌾`
  );
}

export function deliveryUpdateMessage(delivery: {
  id: string;
  status: string;
  customerName: string;
  driverName?: string;
  estimatedTime?: string;
  dealerName: string;
}): string {
  const statusEmoji: Record<string, string> = {
    delivery_assigned: "📦",
    out_for_delivery: "🚚",
    delivered: "✅",
  };

  const statusText: Record<string, string> = {
    delivery_assigned: "Your order has been assigned for delivery",
    out_for_delivery: "Your order is on the way!",
    delivered: "Your order has been delivered!",
  };

  return (
    `${statusEmoji[delivery.status] || "📦"} *Delivery Update*\n\n` +
    `Hi ${delivery.customerName},\n\n` +
    `${statusText[delivery.status] || "Status updated"}\n\n` +
    `*Order #${delivery.id.slice(-6)}*\n` +
    `From: ${delivery.dealerName}\n` +
    (delivery.driverName ? `Driver: ${delivery.driverName}\n` : "") +
    (delivery.estimatedTime ? `ETA: ${delivery.estimatedTime}\n` : "") +
    `\nTrack your order on Cultivator 🌾`
  );
}

export function orderReadyMessage(order: {
  id: string;
  customerName: string;
  dealerName: string;
  dealerPhone: string;
  total: number;
}): string {
  return (
    `✅ *Order Ready!*\n\n` +
    `Hi ${order.customerName},\n\n` +
    `Your order *#${order.id.slice(-6)}* from ${order.dealerName} is ready for pickup.\n\n` +
    `*Total: ₹${order.total}*\n` +
    `📞 ${order.dealerName}: ${order.dealerPhone}\n\n` +
    `Pick up at your convenience! 🌾`
  );
}

export function lowStockAlertMessage(dealer: {
  name: string;
  phone: string;
  products: { name: string; stock: number }[];
}): string {
  const productLines = dealer.products.map(p => `  ${p.name}: ${p.stock} left`).join("\n");
  return (
    `⚠️ *Low Stock Alert*\n\n` +
    `${dealer.name}, the following products are running low:\n\n` +
    `${productLines}\n\n` +
    `Reorder soon to avoid stockouts! 📦`
  );
}
