"use client";

import { useState } from "react";
import { useDealers } from "@cultivator/ui";
import { useAuth } from "@cultivator/ui/auth-context";
import { PageHeader, SearchInput, StatusBadge, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Search, Plus, Star, Edit, Eye, Store, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

interface DealerForm {
  name: string;
  phone: string;
  email: string;
  village: string;
  district: string;
}

const emptyForm: DealerForm = { name: "", phone: "", email: "", village: "", district: "" };

export default function DealersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: allDealers, loading, error } = useDealers();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DealerForm>(emptyForm);

  const dealers = (allDealers || []) as any[];

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Access denied. Admin only.</div>;
  }

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

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (dealer: any) => {
    setEditingId(dealer.id);
    setForm({
      name: dealer.name || "",
      phone: dealer.phone || "",
      email: dealer.email || "",
      village: dealer.address?.village || "",
      district: dealer.address?.district || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast.error("Please fill in name and phone");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: { village: form.village, district: form.district },
      };

      const url = editingId ? `/api/dealers/${editingId}` : "/api/dealers";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save dealer");
      toast.success(editingId ? "Dealer updated" : "Dealer added");
      setShowModal(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to save dealer");
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <PageHeader
        title="Dealers"
        description={`${dealers.length} total dealers \u00b7 ${dealers.filter((d: any) => d.status === "active").length} active`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
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
                      <p className="text-xs text-[var(--color-text-muted)]">{dealer.address?.district}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-[var(--color-text-muted)]">{dealer.address?.village}</td>
                <td className="py-3 px-4 font-medium">{dealer.phone}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={dealer.status} />
                </td>
                <td className="py-3 px-4 text-[var(--color-text-muted)]">{dealer.products?.length || 0}</td>
                <td className="py-3 px-4 font-bold">{dealer.totalOrders || 0}</td>
                <td className="py-3 px-4">{dealer.totalCustomers || 0}</td>
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
                    <button
                      onClick={() => window.location.href = `/admin/dealers/${dealer.id}`}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => openEdit(dealer)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
                    >
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border)] shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-light)]">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {editingId ? "Edit Dealer" : "Add Dealer"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--color-surface-muted)] rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="Dealer name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="+91..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Village</label>
                  <input type="text" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="Village name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">District</label>
                  <input type="text" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="District name" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--color-border-light)]">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
                {editingId ? "Update Dealer" : "Add Dealer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
