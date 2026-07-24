"use client";

import { AuthProvider } from "@cultivator/ui/auth-context";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
