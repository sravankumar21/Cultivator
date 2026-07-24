"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { useProducts, useDealers } from "@cultivator/ui";
import { LoadingPage } from "@cultivator/ui";
import { formatCurrency } from "@cultivator/utils";
import { ArrowLeft, Phone, Wheat, FlaskConical, Shield, Tractor, Wrench, Leaf, Package, Droplets, Bug } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  seeds: Wheat,
  fertilizers: FlaskConical,
  pesticides: Shield,
  crop_protection: Bug,
  farming_equipment: Tractor,
  tools: Wrench,
  irrigation: Droplets,
  organic: Leaf,
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  seeds: { bg: "from-amber-50 to-amber-100/60", text: "text-amber-600" },
  fertilizers: { bg: "from-emerald-50 to-emerald-100/60", text: "text-emerald-600" },
  pesticides: { bg: "from-red-50 to-red-100/60", text: "text-red-600" },
  crop_protection: { bg: "from-orange-50 to-orange-100/60", text: "text-orange-600" },
  farming_equipment: { bg: "from-blue-50 to-blue-100/60", text: "text-blue-600" },
  tools: { bg: "from-purple-50 to-purple-100/60", text: "text-purple-600" },
  irrigation: { bg: "from-cyan-50 to-cyan-100/60", text: "text-cyan-600" },
  organic: { bg: "from-teal-50 to-teal-100/60", text: "text-teal-600" },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const { data: allProducts, loading } = useProducts();
  const { data: allDealers } = useDealers();

  if (loading) return <LoadingPage message="Loading products..." />;

  const categoryList = [
    { key: "all", label: t.products.all },
    { key: "seeds", label: t.categories.seeds },
    { key: "fertilizers", label: t.categories.fertilizers },
    { key: "pesticides", label: t.categories.pesticides },
    { key: "crop_protection", label: t.categories.cropProtection },
    { key: "farming_equipment", label: t.categories.farmingEquipment },
    { key: "tools", label: t.categories.tools },
    { key: "irrigation", label: t.categories.irrigation },
    { key: "organic", label: t.categories.organic },
  ];

  const filteredProducts = activeCategory === "all"
    ? (allProducts || [])
    : (allProducts || []).filter((p: any) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">{t.products.title}</h1>
            <p className="text-xs text-[var(--color-text-muted)]">{filteredProducts.length} {t.shop.subtitle.split(" ").slice(1).join(" ")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categoryList.map((cat) => {
            const Icon = categoryIcons[cat.key] || Package;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeCategory === cat.key
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25"
                    : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-dark)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const dealer = (allDealers || []).find((d: any) =>
              (d.products as string[]).includes(product.category) && d.status === "active"
            );
            const Icon = categoryIcons[product.category] || Package;
            const colors = categoryColors[product.category] || categoryColors.seeds;

            return (
              <div
                key={product.id}
                className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 hover-lift shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <span className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-muted)] px-2.5 py-1 rounded-lg border border-[var(--color-border-light)]">
                    {product.sku}
                  </span>
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-1 text-base">
                  {product.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {product.brand} &middot; {product.unit}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    {formatCurrency(product.price)}
                  </span>
                  {dealer && (
                    <a
                      href={`tel:${dealer.phone.replace(/\D/g, "")}`}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {t.shop.callDealer}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-muted)] flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-light)]">
              <Package className="w-10 h-10 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t.products.noProducts}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{t.products.noProductsDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
