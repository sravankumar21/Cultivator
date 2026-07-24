"use client";

import { useState } from "react";
import { useCustomers } from "@cultivator/ui";
import { formatCurrency, formatDate } from "@cultivator/utils";
import { PageHeader, SearchInput, LoadingPage, EmptyState, ErrorState, Modal } from "@cultivator/ui";
import { Search, Phone, MapPin, UserPlus, ShoppingCart, User, Users, RefreshCw, X, Loader2 } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";
import { toast } from "sonner";

export default function CustomersPage() {
  const { user } = useAuth();
  const DEALER_ID = user?.dealerId || "";
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
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
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddCustomerModal dealerId={DEALER_ID} onClose={() => setShowAddModal(false)} onCreated={() => { setShowAddModal(false); window.location.reload(); }} />
      )}
    </div>
  );
}

function AddCustomerModal({ dealerId, onClose, onCreated }: { dealerId: string; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) { setError("Name and phone are required"); return; }
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/customers", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, phone, village: village || undefined, dealerId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Customer added");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to add customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Add Customer</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)]"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Customer name" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Phone *</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Village</label>
          <input type="text" value={village} onChange={(e) => setVillage(e.target.value)}
            placeholder="Village name" className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading || !name || !phone}
          className="w-full h-11 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Customer"}
        </button>
      </form>
    </Modal>
  );
}
