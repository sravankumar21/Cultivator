import { cn } from "../lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline" | "purple" | "cyan" | "indigo";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  pulse?: boolean;
}

function Badge({ children, variant = "default", size = "sm", dot = false, pulse = false }: BadgeProps) {
  const variants = {
    default: "bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10",
    error: "bg-red-50 text-red-700 ring-1 ring-red-600/10",
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/10",
    outline: "bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)]",
    purple: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/10",
    cyan: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10",
    indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10",
  };

  const dotColors = {
    default: "bg-[var(--color-text-muted)]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    outline: "bg-[var(--color-text-muted)]",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    indigo: "bg-indigo-500",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variants[variant],
        sizes[size]
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant], pulse && "animate-pulse")} />
      )}
      {children}
    </span>
  );
}

export { Badge };
