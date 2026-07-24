"use client";

import { useState } from "react";
import { useProducts } from "@cultivator/ui";
import { useAuth } from "@cultivator/ui/auth-context";
import { formatCurrency } from "@cultivator/utils";
import { PageHeader, SearchInput, StatusBadge, LoadingPage, ErrorState } from "@cultivator/ui";
import { Search, Plus, Edit, Trash2, X, Wheat, FlaskConical, Shield, Package, Tractor, Wrench, Droplets, Leaf, Bug, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductCategory } from "@cultivator/types";

const categories = [
  { value: "seeds", label: "Seeds", icon: Wheat },
  { value: "fertilizers", label: "Fertilizers", icon: FlaskConical },
  { value: "pesticides", label: "Pesticides", icon: Shield },
  { value: "crop_protection", label: "Crop Protection", icon: Bug },
  { value: "farming_equipment", label: "Farming Equipment", icon: Tractor },
  { value: "tools", label: "Tools", icon: Wrench },
  { value: "irrigation", label: "Irrigation", icon: Droplets },
  { value: "organic", label: "Organic", icon: Leaf },
];

const categoryColors: Record<string, string> = {
  seeds: "from-amber-50 to-amber-100/50 text-amber-600",
  fertilizers: "from-emerald-50 to-emerald-100/50 text-emerald-600",
  pesticides: "from-red-50 to-red-100/50 text-red-600",
  crop_protection: "from-orange-50 to-orange-100/50 text-orange-600",
  farming_equipment: "from-blue-50 to-blue-100/50 text-blue-600",
  tools: "from-purple-50 to-purple-100/50 text-purple-600",
  irrigation: "from-cyan-50 to-cyan-100/50 text-cyan-600",
  organic: "from-teal-50 to-teal-100/50 text-teal-600",
};

interface ProductForm {
  name: string;
  sku: string;
  category: ProductCategory;
  brand: string;
  description: string;
  price: string;
  unit: string;
  imageUrl: string;
  status: "active" | "inactive";
}

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  category: "seeds",
  brand: "",
  description: "",
  price: "",
  unit: "kg",
  imageUrl: "",
  status: "active",
};

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export default function ProductsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const { data: apiProducts, loading, error } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const products = (apiProducts || []) as Product[];

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Access denied. Admin only.</div>;
  }

  if (loading) return <LoadingPage message="Loading products..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" />Retry</button>} />;

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      description: product.description || "",
      price: String(product.price),
      unit: product.unit,
      imageUrl: product.imageUrl || "",
      status: product.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.sku || !form.price) {
      toast.error("Please fill in name, SKU, and price");
      return;
    }
    setSaving(true);
    try {
      const headers = getAuthHeaders();
      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        brand: form.brand,
        description: form.description,
        price: Number(form.price),
        unit: form.unit,
        imageUrl: form.imageUrl,
        status: form.status,
      };

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save product");
      toast.success(editingId ? "Product updated" : "Product added");
      setShowModal(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/products/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <PageHeader
        title="Products"
        description={`${products.length} products in catalog`}
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      <div className="mb-6 max-w-md">
        <SearchInput
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => {
          const cat = categories.find((c) => c.value === product.category);
          const Icon = cat?.icon || Package;
          const colors = categoryColors[product.category] || "from-slate-50 to-slate-100/50 text-slate-600";
          return (
            <div key={product.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <StatusBadge status={product.status === "active" ? "active" : "inactive"} />
              </div>
              <h3 className="font-bold text-[var(--color-text-primary)] mb-1">{product.name}</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                {product.brand} &middot; {product.sku} &middot; {product.unit}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[var(--color-primary)]">
                  {formatCurrency(product.price)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No products found</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border)] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-light)]">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--color-surface-muted)] rounded-lg transition-colors">
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Product Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="e.g. Hybrid Rice Seeds" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">SKU *</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="e.g. SED-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]">
                    {categories.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Brand</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="e.g. Bayer" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] resize-none" placeholder="Product description..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Price (INR) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="0" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]">
                    <option value="kg">kg</option><option value="g">g</option><option value="ltr">ltr</option><option value="ml">ml</option><option value="pcs">pcs</option><option value="bag">bag</option><option value="box">box</option><option value="pack">pack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]">
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Image URL</label>
                <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" placeholder="https://..." />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--color-border-light)]">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20 disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
