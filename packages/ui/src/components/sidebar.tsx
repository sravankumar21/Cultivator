import { useState, createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { Avatar } from "./avatar";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
});

interface SidebarProps {
  children: ReactNode;
  collapsed?: boolean;
}

function Sidebar({ children, collapsed: initialCollapsed = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <aside
        className={cn(
          "flex flex-col h-screen bg-[var(--color-surface-elevated)] border-r border-[var(--color-border-light)] transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

function SidebarHeader({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(SidebarContext);
  return (
    <div
      className={cn(
        "flex items-center h-16 px-4 border-b border-[var(--color-border-light)]",
        ctx.collapsed && "justify-center px-2",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SidebarNavProps {
  children: ReactNode;
  label?: string;
}

function SidebarNav({ children, label }: SidebarNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3">
      {label && (
        <p className="px-3 mb-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {label}
        </p>
      )}
      <div className="space-y-1">{children}</div>
    </nav>
  );
}

interface SidebarItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: string | number;
}

function SidebarItem({ href, icon, label, badge }: SidebarItemProps) {
  const pathname = usePathname();
  const ctx = useContext(SidebarContext);
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-[var(--color-primary-50)] text-[var(--color-primary)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]",
        ctx.collapsed && "justify-center px-2"
      )}
      title={ctx.collapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!ctx.collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge !== undefined && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--color-primary)] text-white">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function SidebarFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "p-3 border-t border-[var(--color-border-light)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function SidebarUser({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image?: string;
}) {
  const ctx = useContext(SidebarContext);
  return (
    <div className={cn("flex items-center gap-3", ctx.collapsed && "justify-center")}>
      <Avatar name={name} src={image} size="md" />
      {!ctx.collapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
            {name}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] truncate">{role}</p>
        </div>
      )}
    </div>
  );
}

export {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarItem,
  SidebarFooter,
  SidebarUser,
};
