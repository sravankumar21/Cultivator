"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useProducts, useDealers } from "@cultivator/ui";
import { formatCurrency, getProductImage } from "@cultivator/utils";
import { ArrowRight, Phone, Wheat, FlaskConical, Shield, Tractor, Wrench, Leaf, Package, Droplets, Bug, Camera } from "lucide-react";

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

export function FeaturedProducts() {
  const { t, language } = useI18n();
  const { data: allProducts } = useProducts();
  const { data: allDealers } = useDealers();
  const featured = (allProducts || []).filter((p: any) => p.status === "active").slice(0, 6);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-section-alt)] via-[var(--color-surface)] to-[var(--color-section-cool)]" />
      <div className="absolute inset-0 mesh-bg opacity-40" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-full mb-4 border border-[var(--color-primary-100)]">
              {t.featured.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
              {t.featured.title}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t.featured.subtitle}
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-xl hover:bg-[var(--color-primary-100)] border border-[var(--color-primary-100)] transition-all duration-200"
          >
            {t.featured.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((product) => {
            const Icon = categoryIcons[product.category] || Package;
            const colors = categoryColors[product.category] || "from-slate-50 to-slate-100/50 text-slate-600";
            const dealer = (allDealers || []).find((d: any) => (d.products as string[]).includes(product.category) && d.status === "active");
            const hasImage = !!product.imageUrl;
            const imageUrl = getProductImage(product.imageUrl, product.category);

            return (
              <div
                key={product.id}
                className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] overflow-hidden hover-lift shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={language === "te" && product.nameTe ? product.nameTe : product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {!hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] flex items-center justify-center">
                      <Icon className="w-12 h-12 text-[var(--color-primary)]" />
                    </div>
                  )}
                  {product.imageUploadedByDealer && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-[10px] font-medium rounded-md backdrop-blur-sm">
                      <Camera className="w-3 h-3" />
                      Image uploaded by dealer
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-muted)] px-2 py-1 rounded-lg">
                      {language === "te" && product.brandTe ? product.brandTe : product.brand}
                    </span>
                  </div>
                  <h3 className="font-bold text-[var(--color-text-primary)] mb-1">{language === "te" && product.nameTe ? product.nameTe : product.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-4">{language === "te" && product.unitTe ? product.unitTe : product.unit}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[var(--color-primary)]">
                      {formatCurrency(product.price)}
                    </span>
                    {dealer && (
                      <a
                        href={`tel:${dealer.phone.replace(/\D/g, "")}`}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all duration-300"
                      >
                        <Phone className="w-3 h-3" />
                        {t.featured.call}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-xl hover:bg-[var(--color-primary-100)] border border-[var(--color-primary-100)] transition-all duration-200"
          >
            {t.featured.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
