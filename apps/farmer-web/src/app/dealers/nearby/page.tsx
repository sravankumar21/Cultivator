"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useDealers } from "@cultivator/ui";
import { sortByDistance, getDistanceLabel, isOpenNow } from "@cultivator/utils";
import type { Dealer } from "@cultivator/types";
import { ArrowLeft, Search, MapPin, Phone, Star, Truck, Clock, ChevronRight, Loader2, Navigation } from "lucide-react";

const categoryKeyMap: Record<string, string> = {
  seeds: "seeds",
  fertilizers: "fertilizers",
  pesticides: "pesticides",
  equipment: "equipment",
  tools: "tools",
  organic: "organic",
  crop_protection: "cropProtection",
};

export default function NearbyDealersPage() {
  const { t, language } = useI18n();
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const { data: allDealers } = useDealers();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enable it in settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable. Using default location.");
            setUserLocation({ lat: 18.3246, lng: 78.2345 });
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out. Using default.");
            setUserLocation({ lat: 18.3246, lng: 78.2345 });
            break;
          default:
            setLocationError("Unable to get your location.");
            setUserLocation({ lat: 18.3246, lng: 78.2345 });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Auto-request location on mount
  useMemo(() => {
    if (!userLocation) requestLocation();
  }, []);

  const dealersWithDistance = useMemo(() => {
    if (!userLocation) return [];
    const activeDealers = (allDealers || []).filter((d: any) => d.status === "active");
    return sortByDistance(activeDealers, userLocation);
  }, [userLocation, allDealers]);

  const filteredDealers = useMemo(() => {
    if (!search.trim()) return dealersWithDistance;
    const q = search.toLowerCase();
    return dealersWithDistance.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.address.village?.toLowerCase().includes(q) ||
        d.address.district.toLowerCase().includes(q) ||
        d.address.pincode.includes(q)
    );
  }, [search, dealersWithDistance]);

  const locationLabel = userLocation ? "your location" : "default location";

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight">{t.dealers.nearby}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.dealers.searchPlaceholder}
                className="w-full h-12 pl-11 pr-4 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
          <button
            onClick={requestLocation}
            disabled={locationLoading}
            className="h-12 px-5 flex items-center gap-2 bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-100)] border border-[var(--color-primary-100)] transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            <span className="hidden sm:inline">{t.dealers.useLocation}</span>
          </button>
        </div>

        {locationError && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4">{locationError}</p>
        )}

        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {t.dealers.showing.replace("{count}", String(filteredDealers.length)).replace("{location}", locationLabel)}
        </p>

        <div className="space-y-4">
          {filteredDealers.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} distance={dealer.distance} />
          ))}
        </div>

        {filteredDealers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-muted)] flex items-center justify-center mx-auto mb-4 border border-[var(--color-border-light)]">
              <MapPin className="w-10 h-10 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t.dealers.noDealers}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{t.dealers.noDealersDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DealerCard({ dealer, distance }: { dealer: Dealer; distance: number }) {
  const { t, language } = useI18n();
  const isOpen = isOpenNow(dealer.operatingHours.open, dealer.operatingHours.close);

  return (
    <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate">
            {language === "te" && dealer.nameTe ? dealer.nameTe : dealer.name}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {dealer.address.village}, {dealer.address.district}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <div className="text-sm font-bold text-[var(--color-primary)] bg-[var(--color-primary-50)] px-3 py-1 rounded-lg border border-[var(--color-primary-100)]">
            {getDistanceLabel(distance)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${isOpen ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" : "bg-slate-50 text-slate-600 ring-1 ring-slate-600/10"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-slate-400"}`} />
          {isOpen ? t.dealers.openNow : t.dealers.closedNow}
        </span>
        {dealer.rating > 0 && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {dealer.rating}
          </span>
        )}
        {dealer.delivery.available && (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <Truck className="w-3.5 h-3.5" />
            {t.dealers.homeDelivery}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {dealer.products.map((cat) => (
          <span key={cat} className="px-2.5 py-1 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-border-light)]">
            {t.categories[categoryKeyMap[cat] as keyof typeof t.categories] || cat}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <a href={`tel:${dealer.phone.replace(/\D/g, "")}`}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-4 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all duration-300 hover:-translate-y-0.5">
          <Phone className="w-4 h-4" />
          {t.dealers.callDealer}
        </a>
        <Link href={`/dealers/${dealer.id}`}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-4 bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] text-sm font-semibold rounded-xl hover:bg-[var(--color-border)] transition-colors border border-[var(--color-border-light)]">
          {t.dealers.viewDetails}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
