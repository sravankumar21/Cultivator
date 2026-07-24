import type { Metadata } from "next";
import "../globals.css";
import "@cultivator/ui/styles/globals.css";

export const metadata: Metadata = {
  title: "Cultivator Dealer Portal",
  description: "Manage your agricultural business with Cultivator",
};

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
