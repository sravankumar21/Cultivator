"use client";

import { useState } from "react";
import { useOrders, useCustomers, useProducts } from "@cultivator/ui";
import { formatCurrency, formatDateTime } from "@cultivator/utils";
import { PageHeader, StatusBadge, LoadingPage, EmptyState, ErrorState, Modal } from "@cultivator/ui";
import { Plus, Eye, Truck, ShoppingCart, Package, RefreshCw, X, Loader2 } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";
import { toast } from "sonner";

export default function OrdersPage() {
  const { user } = useAuth();
  const DEALER_ID = user?.dealerId || "";
  const [filter, setFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: allOrders, loading, error } = useOrders({ dealerId: DEALER_ID });

  const statusFilters = ["all", "new", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
  const filtered = filter === "all" ? (allOrders || []) : (allOrders || []).filter((o: any) => o.status === filter);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!newStatus) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(`Order status updated to ${newStatus.replace(/_/g, " ")}`);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  if (loading) return <LoadingPage message="Loading orders..." />;
  if (error) return <ErrorState title="Error loading orders" description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>} />;

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Orders"
        description={`${filtered.length} orders`}
        action={
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
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
                <select
                  value=""
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                >
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

      {showCreateModal && (
        <CreateOrderModal
          dealerId={DEALER_ID}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); window.location.reload(); }}
        />
      )}
    </div>
  );
}

function CreateOrderModal({ dealerId, onClose, onCreated }: { dealerId: string; onClose: () => void; onCreated: () => void }) {
  const { data: customers } = useCustomers({ dealerId });
  const { data: products } = useProducts();
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !productId) { setError("Select customer and product"); return; }
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify({ customerId, productId, quantity: parseInt(quantity), dealerId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Order created");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Create Order</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)]"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Customer *</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
            <option value="">Select customer</option>
            {(customers || []).map((c: any) => (
              <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Product *</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
            <option value="">Select product</option>
            {(products || []).filter((p: any) => p.status === "active").map((p: any) => (
              <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}/{p.unit}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Quantity</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading || !customerId || !productId}
          className="w-full h-11 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Order"}
        </button>
      </form>
    </Modal>
  );
}
