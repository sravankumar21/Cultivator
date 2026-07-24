"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Store, Map, Package, BarChart3, Settings,
  Sprout, Shield
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dealers", label: "Dealers", icon: Store },
  { href: "/admin/map", label: "Network Map", icon: Map },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[var(--color-surface)]">
      <aside className="w-[260px] flex-shrink-0 flex flex-col bg-[var(--color-surface-elevated)] border-r border-[var(--color-border-light)]">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--color-border-light)]">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-text-primary)] flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-[var(--color-text-primary)]">Cultivator</span>
            <span className="text-xs text-[var(--color-text-muted)] block -mt-0.5">Enterprise</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-border-light)]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[var(--color-text-primary)] text-white font-semibold text-sm flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">Admin User</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">Enterprise Admin</p>
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
