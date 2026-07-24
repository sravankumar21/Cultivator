import { cn } from "../lib/utils";
import { getInitials } from "@cultivator/utils";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold flex items-center justify-center",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
