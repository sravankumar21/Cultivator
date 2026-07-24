import { cn } from "../lib/utils";
import type { ReactNode } from "react";

export interface FilterTabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  className?: string;
}

function FilterTabs<T extends string>({ value, onChange, options, className }: FilterTabsProps<T>) {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
            value === option.value
              ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
              : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-dark)]"
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className={cn(
              "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
              value === option.value
                ? "bg-white/20 text-white"
                : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
            )}>
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export { FilterTabs };
