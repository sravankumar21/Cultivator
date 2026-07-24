import { cn } from "../lib/utils";
import type { ReactNode } from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "success" | "warning" | "error" | "info" | "accent";
  size?: "md" | "lg";
  className?: string;
}

function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp = true,
  variant = "default",
  size = "md",
  className,
}: StatCardProps) {
  const iconBg = {
    default: "bg-[var(--color-primary-50)] text-[var(--color-primary)]",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    error: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600",
    accent: "bg-[var(--color-accent-50)] text-[var(--color-accent)]",
  };

  const valueColor = {
    default: "text-[var(--color-text-primary)]",
    success: "text-emerald-600",
    warning: "text-amber-600",
    error: "text-red-600",
    info: "text-blue-600",
    accent: "text-[var(--color-accent)]",
  };

  return (
    <div className={cn(
      "bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", iconBg[variant])}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            trendUp
              ? "text-emerald-700 bg-emerald-50"
              : "text-red-700 bg-red-50"
          )}>
            {trendUp ? "+" : ""}{trend}
          </span>
        )}
      </div>
      <p className={cn(
        "font-bold tracking-tight",
        size === "lg" ? "text-2xl" : "text-xl",
        valueColor[variant]
      )}>
        {value}
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1">{label}</p>
    </div>
  );
}

export { StatCard };
