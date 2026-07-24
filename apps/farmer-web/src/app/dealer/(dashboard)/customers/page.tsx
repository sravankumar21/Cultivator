"use client";

import { useState } from "react";
import { useCustomers } from "@cultivator/ui";
import { formatCurrency, formatDate } from "@cultivator/utils";
import { PageHeader, SearchInput, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Search, Phone, MapPin, UserPlus, ShoppingCart, User, Users, RefreshCw } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";

export default function CustomersPage() {
  const { user } = useAuth();
  const DEALER_ID = (user as any)?.dealerId || "dlr-001";
  const [search, setSearch] = useState("");
  const { data: allCustomers, loading, error } = useCustomers({ dealerId: DEALER_ID });
  const customers = allCustomers || [];

  const filtered = search
    ? customers.filter(
        (c: any) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search) ||
          c.village?.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  if (loading) return <LoadingPage message="Loading customers..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>} />;

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Customers"
        description={`${filtered.length} customers total`}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        }
      />

      <div className="mb-6">
        <SearchInput
          placeholder="Search by name, phone, or village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState icon={<Users className="w-8 h-8" />} title="No customers found" description="No customers match your current search" />
        ) : filtered.map((customer) => (
          <div key={customer.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-white font-bold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
                  {customer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text-primary)]">{customer.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                    {customer.phone}
                  </p>
                  {customer.village && (
                    <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {customer.village}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-lg font-bold text-[var(--color-primary)]">{formatCurrency(customer.totalSpent)}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{customer.totalOrders} orders</p>
              </div>
            </div>
            {customer.lastOrderDate && (
              <p className="text-xs text-[var(--color-text-muted)] mt-3 pl-16">
                Last order: {formatDate(customer.lastOrderDate)}
              </p>
            )}
            <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-border-light)] pl-16">
              <a
                href={`tel:${customer.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                <ShoppingCart className="w-3.5 h-3.5" />
                New Order
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                <User className="w-3.5 h-3.5" />
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
