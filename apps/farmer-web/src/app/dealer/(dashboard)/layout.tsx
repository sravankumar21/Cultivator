import { DealerShell } from "@/components/dealer-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DealerShell>{children}</DealerShell>;
}
