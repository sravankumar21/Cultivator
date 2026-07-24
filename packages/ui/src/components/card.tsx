import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered" | "glass" | "gradient-border";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  glow?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hover = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-[var(--color-surface-elevated)] border border-[var(--color-border-light)] shadow-sm",
      elevated: "bg-[var(--color-surface-elevated)] shadow-lg border border-[var(--color-border-light)]",
      bordered: "bg-[var(--color-surface-elevated)] border border-[var(--color-border)]",
      glass: "glass",
      "gradient-border": "gradient-border bg-[var(--color-surface-elevated)]",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          variants[variant],
          paddings[padding],
          hover && "hover-lift cursor-pointer",
          glow && "hover-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
