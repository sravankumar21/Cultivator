import type { Metadata } from "next";
import "../globals.css";
import "@cultivator/ui/styles/globals.css";
import { DealerShell } from "@/components/dealer-shell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cultivator Dealer Portal",
  description: "Manage your agricultural business with Cultivator",
};

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DealerShell>{children}</DealerShell>
  );
}
