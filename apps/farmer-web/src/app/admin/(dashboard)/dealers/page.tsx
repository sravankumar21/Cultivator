"use client";

import { useState } from "react";
import { useDealers } from "@cultivator/ui";
import { formatCurrency } from "@cultivator/utils";
import { PageHeader, SearchInput, StatusBadge, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Search, Plus, Star, Edit, Eye, Store, RefreshCw } from "lucide-react";

export default function DealersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: allDealers, loading, error } = useDealers();
  const dealers = (allDealers || []) as any[];

  if (loading) return <LoadingPage message="Loading dealers..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" />Retry</button>} />;

  const filtered = dealers.filter((d: any) => {
    const matchesSearch = search
      ? d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.address?.village?.toLowerCase().includes(search.toLowerCase()) ||
        d.address?.district?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <PageHeader
        title="Dealers"
        description={`${dealers.length} total dealers \u00b7 ${dealers.filter((d: any) => d.status === "active").length} active`}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
            <Plus className="w-4 h-4" />
            Add Dealer
          </button>
        }
      />

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search dealers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 px-4 text-sm font-medium bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface-muted)]">
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Dealer</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Location</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Products</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Orders</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Customers</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Rating</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <EmptyState icon={<Store className="w-8 h-8" />} title="No dealers found" description="No dealers match your current filter" />
                </td>
              </tr>
            ) : filtered.map((dealer) => (
              <tr key={dealer.id} className="border-t border-[var(--color-border-light)] hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {dealer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold">{dealer.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{dealer.address.district}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-[var(--color-text-muted)]">{dealer.address.village}</td>
                <td className="py-3 px-4 font-medium">{dealer.phone}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={dealer.status} />
                </td>
                <td className="py-3 px-4 text-[var(--color-text-muted)]">{dealer.products.length}</td>
                <td className="py-3 px-4 font-bold">{dealer.totalOrders}</td>
                <td className="py-3 px-4">{dealer.totalCustomers}</td>
                <td className="py-3 px-4">
                  {dealer.rating > 0 ? (
                    <span className="flex items-center gap-1 font-semibold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {dealer.rating}
                    </span>
                  ) : "\u2014"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1.5">
                    <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
