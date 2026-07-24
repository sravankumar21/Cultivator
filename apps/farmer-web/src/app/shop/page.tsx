"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useProducts, useDealers } from "@cultivator/ui";
import { LoadingPage, ErrorState } from "@cultivator/ui";
import { formatCurrency, getProductImage } from "@cultivator/utils";
import { Search, ArrowLeft, Phone, Wheat, FlaskConical, Shield, Tractor, Wrench, Leaf, Package, Droplets, Bug, MapPin, Camera } from "lucide-react";

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

export default function ShopPage() {
  const { t, language } = useI18n();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: allProducts, loading: productsLoading } = useProducts();
  const { data: allDealers } = useDealers();

  if (productsLoading) return <LoadingPage message="Loading products..." />;

  const categoryList = [
    { value: "all", label: t.products.all },
    { value: "seeds", label: t.categories.seeds },
    { value: "fertilizers", label: t.categories.fertilizers },
    { value: "pesticides", label: t.categories.pesticides },
    { value: "crop_protection", label: t.categories.cropProtection },
    { value: "farming_equipment", label: t.categories.farmingEquipment },
    { value: "tools", label: t.categories.tools },
    { value: "irrigation", label: t.categories.irrigation },
    { value: "organic", label: t.categories.organic },
  ];

  const products = (allProducts || []).filter((p: any) => p.status === "active");
  const filtered = products.filter((p: any) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()) || (p.nameTe && p.nameTe.includes(search)) || (p.brandTe && p.brandTe.includes(search));
    return matchesCategory && matchesSearch;
  });

  const getNearestDealer = (productCategory: string) => {
    return (allDealers || []).find((d: any) =>
      (d.products as string[]).includes(productCategory) && d.status === "active"
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight">{t.shop.title}</h1>
            <p className="text-xs text-[var(--color-text-muted)]">{t.shop.subtitle.replace("{count}", String(filtered.length))}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.shop.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] shadow-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categoryList.map((cat) => {
            const Icon = categoryIcons[cat.value] || Package;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeCategory === cat.value
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
          {filtered.map((product) => {
            const dealer = getNearestDealer(product.category);
            const Icon = categoryIcons[product.category] || Package;
            const colors = categoryColors[product.category] || "from-slate-50 to-slate-100/50 text-slate-600";
            const hasImage = !!product.imageUrl;
            const imageUrl = getProductImage(product.imageUrl, product.category);

            return (
              <div
                key={product.id}
                className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] overflow-hidden hover-lift shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={language === "te" && product.nameTe ? product.nameTe : product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {!hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center">
                      <Icon className="w-14 h-14 text-[var(--color-primary)]" />
                    </div>
                  )}
                  {product.imageUploadedByDealer && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-[10px] font-medium rounded-md backdrop-blur-sm">
                      <Camera className="w-3 h-3" />
                      Image uploaded by dealer
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-xs font-mono text-white bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                    {product.sku}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[var(--color-text-primary)] mb-1 text-base">
                    {language === "te" && product.nameTe ? product.nameTe : product.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-1">
                    {language === "te" && product.brandTe ? product.brandTe : product.brand} &middot; {language === "te" && product.unitTe ? product.unitTe : product.unit}
                  </p>
                  {product.description && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-4 line-clamp-2">{product.description}</p>
                  )}
                  {!product.description && <div className="mb-4" />}
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
                  {dealer && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border-light)] flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                      <MapPin className="w-3 h-3" />
                      <span>{language === "te" && dealer.nameTe ? dealer.nameTe : dealer.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-muted)] flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-light)]">
              <Package className="w-10 h-10 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t.shop.noProducts}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{t.shop.noProductsDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
