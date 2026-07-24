import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "glass" | "gradient";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.97]";

    const variants = {
      primary:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] focus-visible:ring-[var(--color-primary)] shadow-sm hover:shadow-lg hover:shadow-[var(--color-primary)]/20",
      secondary:
        "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] focus-visible:ring-[var(--color-text-muted)]",
      ghost:
        "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] focus-visible:ring-[var(--color-text-muted)]",
      danger:
        "bg-[var(--color-error)] text-white hover:bg-red-700 focus-visible:ring-[var(--color-error)] shadow-sm hover:shadow-lg hover:shadow-red-500/20",
      outline:
        "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-dark)] focus-visible:ring-[var(--color-text-muted)]",
      glass:
        "glass text-[var(--color-text-primary)] hover:bg-white/80 focus-visible:ring-[var(--color-primary)] shadow-sm hover:shadow-md",
      gradient:
        "text-white focus-visible:ring-[var(--color-primary)] shadow-sm hover:shadow-lg hover:shadow-[var(--color-primary)]/25 active:scale-[0.97]",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
      xl: "h-14 px-8 text-lg gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    const gradientStyle = variant === "gradient" ? { background: "var(--gradient-primary)" } : undefined;

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        style={gradientStyle}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
