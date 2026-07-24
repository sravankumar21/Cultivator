"use client";

import { useState } from "react";
import { useInventory, useProducts } from "@cultivator/ui";
import { formatCurrency } from "@cultivator/utils";
import { PageHeader, FilterTabs, StatusBadge, LoadingPage, EmptyState, ErrorState, Modal } from "@cultivator/ui";
import { Plus, Package, Pencil, RefreshCw, X, Loader2 } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";
import { toast } from "sonner";

export default function InventoryPage() {
  const { user } = useAuth();
  const DEALER_ID = user?.dealerId || "";
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const { data: allInventory, loading, error } = useInventory({ dealerId: DEALER_ID });
  const inventory = allInventory || [];

  const filtered =
    filter === "all"
      ? inventory
      : filter === "low"
      ? inventory.filter((i: any) => i.quantity > 0 && i.quantity <= i.lowStockThreshold)
      : inventory.filter((i: any) => i.quantity === 0);

  if (loading) return <LoadingPage message="Loading inventory..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>} />;

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Inventory"
        description={`${filtered.length} items`}
        action={
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
            <Plus className="w-4 h-4" />
            Add Stock
          </button>
        }
      />

      <div className="mb-6">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: inventory.length },
            { value: "low", label: "Low Stock" },
            { value: "out", label: "Out of Stock" },
          ]}
        />
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16">
            <EmptyState icon={<Package className="w-8 h-8" />} title="No inventory items found" description="No items match your current filter" />
          </div>
        ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-muted)]">
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Product</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">SKU</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Qty</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Reserved</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-[var(--color-border-light)] hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center">
                      <Package className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <span className="font-semibold">{item.product?.name || item.productId}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-[var(--color-text-muted)]">{item.product?.sku || "\u2014"}</td>
                <td className="py-3 px-4 font-bold">{item.quantity}</td>
                <td className="py-3 px-4 text-[var(--color-text-muted)]">{item.reserved}</td>
                <td className="py-3 px-4 font-semibold">{formatCurrency(item.price)}</td>
                <td className="py-3 px-4">
                  <StatusBadge
                    status={item.quantity === 0 ? "out_of_stock" : item.quantity <= item.lowStockThreshold ? "low" : "in_stock"}
                  />
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => setEditItem(item)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                    <Pencil className="w-3 h-3" />
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {showAddModal && (
        <AddStockModal dealerId={DEALER_ID} onClose={() => setShowAddModal(false)} onCreated={() => { setShowAddModal(false); window.location.reload(); }} />
      )}
      {editItem && (
        <UpdateStockModal item={editItem} onClose={() => setEditItem(null)} onUpdated={() => { setEditItem(null); window.location.reload(); }} />
      )}
    </div>
  );
}

function AddStockModal({ dealerId, onClose, onCreated }: { dealerId: string; onClose: () => void; onCreated: () => void }) {
  const { data: products } = useProducts();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity) { setError("Select product and enter quantity"); return; }
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers,
        body: JSON.stringify({ productId, quantity: parseInt(quantity), dealerId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Stock added");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Add Stock</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)]"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Product *</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
            <option value="">Select product</option>
            {(products || []).filter((p: any) => p.status === "active").map((p: any) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Quantity *</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading || !productId || !quantity}
          className="w-full h-11 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Stock"}
        </button>
      </form>
    </Modal>
  );
}

function UpdateStockModal({ item, onClose, onUpdated }: { item: any; onClose: () => void; onUpdated: () => void }) {
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`/api/inventory/${item.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ quantity: parseInt(quantity) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Stock updated");
      onUpdated();
    } catch (err: any) {
      setError(err.message || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Update Stock — {item.product?.name || item.productId}</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)]"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Quantity</label>
          <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Current: {item.quantity} | Reserved: {item.reserved}</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full h-11 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : "Update Stock"}
        </button>
      </form>
    </Modal>
  );
}
