// Send push notification to dealer when order arrives or delivery updates
import { prisma } from "./prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let admin: any = null;

async function initFirebase() {
  if (admin) return admin;
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) return null;

  // Dynamic require to avoid type issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  admin = require("firebase-admin");
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
  }
  return admin;
}

async function sendPush(token: string, title: string, body: string, url: string) {
  const fb = await initFirebase();
  if (!fb) {
    console.log(`[Push Demo] ${title}: ${body}`);
    return true;
  }
  try {
    await fb.messaging().send({ token, notification: { title, body }, data: { url } });
    return true;
  } catch {
    await prisma.pushToken.updateMany({ where: { token }, data: { active: false } });
    return false;
  }
}

export async function sendPushToDealer(dealerId: string, title: string, body: string, url?: string) {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: { role: "dealer", active: true },
      select: { token: true },
    });
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log(`[Push Demo] Dealer ${dealerId}: ${title} — ${body}`);
      return;
    }
    for (const { token } of tokens) await sendPush(token, title, body, url || "/dealer/orders");
  } catch {}
}

export async function sendPushToAdmin(title: string, body: string, url?: string) {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: { role: "admin", active: true },
      select: { token: true },
    });
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log(`[Push Demo] Admin: ${title} — ${body}`);
      return;
    }
    for (const { token } of tokens) await sendPush(token, title, body, url || "/admin/dashboard");
  } catch {}
}
