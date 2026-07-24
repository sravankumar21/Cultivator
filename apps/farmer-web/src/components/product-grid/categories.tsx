"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { ArrowRight } from "lucide-react";

const categoryImages: Record<string, { src: string; alt: string }> = {
  seeds: {
    src: "https://images.pexels.com/photos/18446086/pexels-photo-18446086.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    alt: "Fresh paddy rice seeds close-up",
  },
  fertilizers: {
    src: "https://images.pexels.com/photos/1251026/pexels-photo-1251026.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    alt: "Green seedlings sprouting from soil",
  },
  pesticides: {
    src: "https://images.pexels.com/photos/1204996/pexels-photo-1204996.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    alt: "Crop spraying in agricultural field",
  },
  equipment: {
    src: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    alt: "Farm tractor in green field",
  },
  tools: {
    src: "https://images.pexels.com/photos/296230/pexels-photo-296230.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    alt: "Gardening tools arrangement",
  },
  organic: {
    src: "https://images.pexels.com/photos/4397028/pexels-photo-4397028.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    alt: "Fresh organic vegetables",
  },
};

export function CategoryGrid() {
  const { t } = useI18n();

  const categories = [
    { key: "seeds" as const },
    { key: "fertilizers" as const },
    { key: "pesticides" as const },
    { key: "equipment" as const },
    { key: "tools" as const },
    { key: "organic" as const },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-section-cool)] via-[var(--color-surface)] to-[var(--color-section-alt)]" />
      <div className="absolute inset-0 mesh-bg opacity-40" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-full mb-4 border border-[var(--color-primary-100)]">
            {t.categories.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
            {t.categories.title}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto">
            {t.categories.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const image = categoryImages[cat.key] || categoryImages.seeds;
            return (
              <Link
                key={cat.key}
                href={`/products?category=${cat.key}`}
                className="group relative flex flex-col items-center p-4 bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] hover:border-[var(--color-primary-200)] hover-lift shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-4 ring-2 ring-[var(--color-primary-100)] group-hover:ring-[var(--color-primary-300)] group-hover:scale-110 transition-all duration-300">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)] mb-1 text-center">
                  {t.categories[cat.key]}
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-200 mt-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
