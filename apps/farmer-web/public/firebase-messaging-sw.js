// Firebase Cloud Messaging service worker
// This file is served from /public/firebase-messaging-sw.js

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: self.__FIREBASE_CONFIG__?.apiKey || "",
  authDomain: self.__FIREBASE_CONFIG__?.authDomain || "",
  projectId: self.__FIREBASE_CONFIG__?.projectId || "",
  storageBucket: self.__FIREBASE_CONFIG__?.storageBucket || "",
  messagingSenderId: self.__FIREBASE_CONFIG__?.messagingSenderId || "",
  appId: self.__FIREBASE_CONFIG__?.appId || "",
};

// Only initialize if config is present
if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Cultivator";
    const options = {
      body: payload.notification?.body || "",
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      data: payload.data || {},
      tag: payload.data?.tag || "cultivator-notification",
    };

    self.registration.showNotification(title, options);
  });

  // Handle notification click
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/";
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clients) => {
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      })
    );
  });
}
