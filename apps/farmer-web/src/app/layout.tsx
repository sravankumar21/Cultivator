import type { Metadata } from "next";
import "./globals.css";
import "@cultivator/ui/styles/globals.css";
import { I18nProvider } from "@/i18n/provider";
import { AuthWrapper } from "@/components/auth-wrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cultivator — Connect with Your Nearest Agricultural Dealer",
  description:
    "Cultivator connects farmers with nearby agricultural dealers. Find seeds, fertilizers, pesticides, and farming equipment. Call your nearest dealer instantly.",
  keywords: "agriculture, farmers, dealers, seeds, fertilizers, pesticides, farming, Telangana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <I18nProvider>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: "var(--color-surface-elevated)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "Inter, system-ui, sans-serif",
                },
              }}
            />
          </I18nProvider>
        </AuthWrapper>
      </body>
    </html>
  );
}
