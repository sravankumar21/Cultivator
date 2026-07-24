// Firebase configuration for browser push notifications
// Replace these with your Firebase project values from:
// https://console.firebase.google.com → Project Settings → General → Your apps

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// VAPID key for push notifications — generate at:
// https://console.firebase.google.com → Project Settings → Cloud Messaging → Web push certificates
export const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
