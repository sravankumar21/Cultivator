"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Phone, Users, Package, ShoppingCart, Truck,
  Sprout, LogOut, Settings
} from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";

const navItems = [
  { href: "/dealer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dealer/shop", label: "Shop", icon: Package },
  { href: "/dealer/calls", label: "Calls", icon: Phone, badge: 3 },
  { href: "/dealer/customers", label: "Customers", icon: Users },
  { href: "/dealer/inventory", label: "Inventory", icon: Package, badge: "!" },
  { href: "/dealer/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dealer/deliveries", label: "Deliveries", icon: Truck },
];

export function DealerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[var(--color-surface)]">
      <aside className="w-[260px] flex-shrink-0 flex flex-col bg-[var(--color-surface-elevated)] border-r border-[var(--color-border-light)]">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--color-border-light)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md shadow-[var(--color-primary)]/20">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-base font-bold text-[var(--color-text-primary)]">Cultivator</span>
            <span className="text-xs text-[var(--color-text-muted)] block -mt-0.5">Dealer Portal</span>
          </div>
          <NotificationBell />
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === "/dealer/dashboard"
              ? pathname === "/dealer/dashboard"
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-primary-50)] text-[var(--color-primary)] shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[var(--color-primary)]" : ""}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full min-w-[20px] text-center ${
                    item.badge === "!"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-[var(--color-primary)] text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-border-light)]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white font-semibold text-sm flex items-center justify-center shadow-sm">
              SL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">Sri Lakshmi Agro</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">Dealer Owner</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
