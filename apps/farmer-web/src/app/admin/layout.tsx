import type { Metadata } from "next";
import "../globals.css";
import "@cultivator/ui/styles/globals.css";
import { AdminShell } from "@/components/admin-shell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cultivator Enterprise Admin",
  description: "Enterprise management dashboard for Cultivator platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>{children}</AdminShell>
  );
}
