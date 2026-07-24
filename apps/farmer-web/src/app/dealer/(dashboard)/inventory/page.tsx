"use client";

import { useState } from "react";
import { useInventory } from "@cultivator/ui";
import { formatCurrency } from "@cultivator/utils";
import { PageHeader, FilterTabs, StatusBadge } from "@cultivator/ui";
import { Plus, Package, Pencil } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";

export default function InventoryPage() {
  const { user } = useAuth();
  const DEALER_ID = (user as any)?.dealerId || "dlr-001";
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const { data: allInventory } = useInventory({ dealerId: DEALER_ID });
  const inventory = allInventory || [];

  const filtered =
    filter === "all"
      ? inventory
      : filter === "low"
      ? inventory.filter((i: any) => i.quantity > 0 && i.quantity <= i.lowStockThreshold)
      : inventory.filter((i: any) => i.quantity === 0);

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Inventory"
        description={`${filtered.length} items`}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
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
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                    <Pencil className="w-3 h-3" />
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
