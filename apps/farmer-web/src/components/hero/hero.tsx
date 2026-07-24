"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { Phone, MapPin, ShoppingBag, ArrowRight, Shield, Wheat, Leaf } from "lucide-react";

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/14686286/pexels-photo-14686286.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(10, 46, 26, 0.88) 0%, rgba(20, 83, 45, 0.82) 30%, rgba(21, 128, 61, 0.75) 70%, rgba(26, 107, 63, 0.80) 100%)",
        }}
      />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-[10%] w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(34, 197, 94, 0.2)" }} />
        <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "rgba(234, 179, 8, 0.12)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-white/90 glass-dark rounded-full animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.hero.trustBadge}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08] animate-fade-in-up">
            {t.hero.title}
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up delay-200">
            <Link
              href="/dealers/nearby"
              className="group flex items-center gap-3 px-8 py-4 text-lg font-semibold text-[var(--color-primary-dark)] bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Phone className="w-5 h-5 text-[var(--color-primary)]" />
              <div className="text-left">
                <div>{t.hero.cta}</div>
                <div className="text-sm font-normal text-[var(--color-text-muted)]">{t.hero.ctaSubtext}</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/dealers/nearby"
              className="group flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-white/90 glass-dark rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              <MapPin className="w-4 h-4" />
              {t.hero.secondary.findDealer}
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Link>
            <Link
              href="/products"
              className="group flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-white/90 glass-dark rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              {t.hero.secondary.browseProducts}
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mt-16 animate-fade-in-up delay-400">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Shield className="w-4 h-4" />
            <span>{t.hero.verifiedDealers}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Wheat className="w-4 h-4" />
            <span>{t.hero.premiumProducts}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Leaf className="w-4 h-4" />
            <span>{t.hero.organicOptions}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
