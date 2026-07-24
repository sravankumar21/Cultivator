"use client";

import { useState } from "react";
import { useOrders } from "@cultivator/ui";
import { formatCurrency, formatDateTime } from "@cultivator/utils";
import { PageHeader, StatusBadge, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Plus, Eye, Truck, ShoppingCart, Package, RefreshCw } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";

export default function OrdersPage() {
  const { user } = useAuth();
  const DEALER_ID = (user as any)?.dealerId || "dlr-001";
  const [filter, setFilter] = useState<string>("all");
  const { data: allOrders, loading, error } = useOrders({ dealerId: DEALER_ID });

  const statusFilters = ["all", "new", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
  const filtered = filter === "all" ? (allOrders || []) : (allOrders || []).filter((o: any) => o.status === filter);

  if (loading) return <LoadingPage message="Loading orders..." />;
  if (error) return <ErrorState title="Error loading orders" description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>} />;

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Orders"
        description={`${filtered.length} orders`}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
            <Plus className="w-4 h-4" />
            Create Order
          </button>
        }
      />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
              filter === f
                ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-dark)] hover:bg-[var(--color-surface-muted)]"
            }`}
          >
            {f === "all" ? "All" : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState icon={<Package className="w-8 h-8" />} title="No orders found" description="No orders match your current filter" />
        ) : filtered.map((order) => (
          <div key={order.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-lg">
                    {order.id.replace("ord-", "Order #")}
                  </h3>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {order.customerId.replace("cust-", "Customer ")}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-xl font-bold text-[var(--color-primary)]">{formatCurrency(order.total)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {formatDateTime(order.createdAt).split(", ").slice(1).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(order.items || []).map((item: any, i: number) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] rounded-lg">
                  <ShoppingCart className="w-3 h-3" />
                  {item.quantity}x {item.product?.name || item.productId} &middot; {formatCurrency(item.total)}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
              <div className="flex gap-2">
                {order.deliveryRequired && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg ring-1 ring-blue-600/10">
                    <Truck className="w-3 h-3" />
                    Delivery
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
                <select className="px-3 py-1.5 text-xs font-semibold bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer">
                  <option value="">Update Status</option>
                  <option value="confirmed">Confirm</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready_for_pickup">Ready</option>
                  <option value="delivery_assigned">Assign Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancel</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
