"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { FarmerNav } from "@/components/shared/nav";
import { HeroSection } from "@/components/hero/hero";
import { HowItWorks } from "@/components/hero/how-it-works";
import { CategoryGrid } from "@/components/product-grid/categories";
import { FeaturedProducts } from "@/components/product-grid/featured-products";
import { TrustBanner } from "@/components/shared/trust-banner";
import { FarmerFooter } from "@/components/shared/footer";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      <FarmerNav />
      <main>
        <HeroSection />
        <HowItWorks />
        <CategoryGrid />
        <FeaturedProducts />
        <TrustBanner />
      </main>
      <FarmerFooter />
    </div>
  );
}
