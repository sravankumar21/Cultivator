"use client";

import { use } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useDealer } from "@cultivator/ui";
import { LoadingPage } from "@cultivator/ui";
import { getDistanceLabel, calculateDistance, isOpenNow } from "@cultivator/utils";
import {
  ArrowLeft, Phone, MapPin, Clock, Truck, Star, MessageCircle,
  Navigation, Shield, Wheat, FlaskConical, Wrench, Leaf, Tractor
} from "lucide-react";

const DOMAKONDA_LOCATION = { lat: 18.3246, lng: 78.2345 };

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  seeds: Wheat,
  fertilizers: FlaskConical,
  pesticides: Shield,
  equipment: Tractor,
  tools: Wrench,
  organic: Leaf,
};

const categoryKeyMap: Record<string, string> = {
  seeds: "seeds",
  fertilizers: "fertilizers",
  pesticides: "pesticides",
  equipment: "equipment",
  tools: "tools",
  organic: "organic",
  crop_protection: "cropProtection",
  irrigation: "irrigation",
  animal_feed: "animalFeed",
};

export default function DealerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, language } = useI18n();
  const { data: dealer, loading } = useDealer(id);

  if (loading) {
    return <LoadingPage message="Loading dealer..." />;
  }

  if (!dealer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <p className="text-[var(--color-text-muted)]">{t.dealers.notAvailable}</p>
      </div>
    );
  }

  const distance = calculateDistance(
    DOMAKONDA_LOCATION.lat,
    DOMAKONDA_LOCATION.lng,
    dealer.location.lat,
    dealer.location.lng
  );

  const isOpen = isOpenNow(dealer.operatingHours.open, dealer.operatingHours.close);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/dealers/nearby" className="p-2 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight truncate">{language === "te" && dealer.nameTe ? dealer.nameTe : dealer.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {language === "te" && dealer.nameTe ? dealer.nameTe : dealer.name}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {dealer.address.village}, {dealer.address.district}, {dealer.address.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${isOpen ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" : "bg-slate-50 text-slate-600 ring-1 ring-slate-600/10"}`}>
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-slate-400"}`} />
              {isOpen ? t.dealers.openNow : t.dealers.closedNow}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)] font-medium">
              {getDistanceLabel(distance)} {t.dealers.away}
            </span>
            {dealer.rating > 0 && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                <Star className="w-4 h-4 fill-amber-400" />
                {dealer.rating}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {(dealer.products || []).map((cat: string) => {
              const Icon = categoryIcons[cat] || Wheat;
              return (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border-light)]"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.categories[categoryKeyMap[cat] as keyof typeof t.categories] || cat}
                </span>
              );
            })}
          </div>

          {dealer.description && (
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {language === "te" && dealer.descriptionTe ? dealer.descriptionTe : dealer.description}
            </p>
          )}
        </div>

        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider">{t.dealers.viewDetails}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4" /> {t.dealers.phone}
              </span>
              <span className="text-sm font-semibold">{dealer.phone}</span>
            </div>
            <div className="h-px bg-[var(--color-border-light)]" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Clock className="w-4 h-4" /> {t.dealers.operatingHours}
              </span>
              <span className="text-sm font-semibold">{dealer.operatingHours.open} - {dealer.operatingHours.close}</span>
            </div>
            <div className="h-px bg-[var(--color-border-light)]" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Truck className="w-4 h-4" /> {t.dealers.delivery}
              </span>
              <span className="text-sm font-semibold">
                {dealer.delivery.available
                  ? `${t.dealers.deliveryAvailable}${dealer.delivery.fee ? ` (\u20B9${dealer.delivery.fee})` : ` (${t.dealers.deliveryFree})`}`
                  : t.dealers.notAvailable}
              </span>
            </div>
            <div className="h-px bg-[var(--color-border-light)]" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4" /> {t.dealers.serviceRadius}
              </span>
              <span className="text-sm font-semibold">{t.dealers.km.replace("{radius}", String(dealer.serviceRadius))}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={`tel:${dealer.phone.replace(/\D/g, "")}`}
            className="flex items-center justify-center gap-3 w-full h-14 bg-[var(--color-primary)] text-white text-lg font-bold rounded-2xl hover:shadow-xl hover:shadow-[var(--color-primary)]/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5" />
            {t.dealers.callNow}
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${dealer.phone.replace(/\D/g, "").replace(/^91/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-12 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#1ebe57] transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {t.dealers.whatsapp}
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.location.lat},${dealer.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-12 bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] text-sm font-semibold rounded-xl hover:bg-[var(--color-border)] transition-colors border border-[var(--color-border-light)]"
            >
              <Navigation className="w-4 h-4" />
              {t.dealers.directions}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
