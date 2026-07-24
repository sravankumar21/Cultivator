import { cn } from "../lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/10" },
  confirmed: { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" },
  preparing: { label: "Preparing", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10" },
  ready_for_pickup: { label: "Ready", className: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/10" },
  delivery_assigned: { label: "Assigned", className: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10" },
  out_for_delivery: { label: "In Transit", className: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10" },
  delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 ring-1 ring-red-600/10" },
  order_received: { label: "Received", className: "bg-slate-50 text-slate-700 ring-1 ring-slate-600/10" },
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10" },
  inactive: { label: "Inactive", className: "bg-slate-50 text-slate-700 ring-1 ring-slate-600/10" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" },
  missed: { label: "Missed", className: "bg-red-50 text-red-700 ring-1 ring-red-600/10" },
  low: { label: "Low Stock", className: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-50 text-red-700 ring-1 ring-red-600/10" },
  in_stock: { label: "In Stock", className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" },
};

const dotColors: Record<string, string> = {
  new: "bg-blue-500",
  confirmed: "bg-emerald-500",
  preparing: "bg-amber-500",
  ready_for_pickup: "bg-purple-500",
  delivery_assigned: "bg-indigo-500",
  out_for_delivery: "bg-cyan-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
  order_received: "bg-slate-500",
  active: "bg-emerald-500",
  pending: "bg-amber-500",
  inactive: "bg-slate-500",
  completed: "bg-emerald-500",
  missed: "bg-red-500",
  low: "bg-amber-500",
  out_of_stock: "bg-red-500",
  in_stock: "bg-emerald-500",
};

function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status.replace(/_/g, " "), className: "bg-slate-50 text-slate-700 ring-1 ring-slate-600/10" };
  const dotColor = dotColors[status] || "bg-slate-500";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full",
        config.className,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
      {config.label}
    </span>
  );
}

export { StatusBadge };
