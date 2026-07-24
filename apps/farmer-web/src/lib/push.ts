// Browser push notification — FCM token management
// Runs client-side only

import { firebaseConfig, vapidKey } from "@/lib/firebase";

let messaging: any = null;

async function getMessaging() {
  if (messaging) return messaging;
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.apiKey) return null;

  try {
    const { getMessaging: fbGetMessaging } = await import("firebase/messaging");
    const { initializeApp } = await import("firebase/app");
    const app = initializeApp(firebaseConfig);
    messaging = fbGetMessaging(app);
    return messaging;
  } catch {
    return null;
  }
}

// Request notification permission and get FCM token
export async function requestPushPermission(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const msg = await getMessaging();
  if (!msg || !vapidKey) return null;

  try {
    const { getToken } = await import("firebase/messaging");
    const token = await getToken(msg, { vapidKey });
    return token;
  } catch {
    return null;
  }
}

// Save FCM token to server
export async function savePushToken(userId: string, role: string): Promise<void> {
  const token = await requestPushPermission();
  if (!token) return;

  try {
    await fetch("/api/notifications/push-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId, role }),
    });
  } catch {
    // Silent fail — push is best-effort
  }
}
