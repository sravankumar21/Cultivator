import { type ReactNode } from "react";
import { cn } from "../lib/utils";

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

function Header({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center h-16 px-6 bg-[var(--color-surface-elevated)] border-b border-[var(--color-border-light)]",
        className
      )}
    >
      {children}
    </header>
  );
}

function HeaderLeft({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-4", className)}>{children}</div>;
}

function HeaderCenter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex-1 flex justify-center", className)}>{children}</div>;
}

function HeaderRight({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-3 ml-auto", className)}>{children}</div>;
}

interface HeaderSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

function HeaderSearch({ placeholder = "Search...", value, onChange }: HeaderSearchProps) {
  return (
    <div className="relative max-w-md w-full">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-9 pl-10 pr-4 text-sm bg-[var(--color-surface-muted)] border-0 rounded-lg placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-[var(--color-surface-elevated)] transition-all"
      />
    </div>
  );
}

function NotificationBell({ count = 0 }: { count?: number }) {
  return (
    <button className="relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold text-white bg-[var(--color-error)] rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

export { Header, HeaderLeft, HeaderCenter, HeaderRight, HeaderSearch, NotificationBell };
