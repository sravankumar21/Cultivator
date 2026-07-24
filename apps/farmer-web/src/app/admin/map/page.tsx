"use client";

import { useDealers } from "@cultivator/ui";
import { MapPin, Store, Truck, Users } from "lucide-react";

export default function MapPage() {
  const { data: allDealers } = useDealers();
  const dealers = (allDealers || []) as any[];
  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Dealer Network Map</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Visual overview of all dealer locations and coverage areas
        </p>
      </div>

      <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 mb-6 shadow-sm">
        <div className="h-[500px] bg-gradient-to-br from-[var(--color-surface-muted)] to-[var(--color-primary-50)] rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[var(--color-primary)] blur-3xl" />
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[var(--color-accent)] blur-3xl" />
          </div>
          <div className="text-center relative">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary-50)] flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Map Integration</h3>
            <p className="text-sm text-[var(--color-text-muted)] max-w-md">
              Leaflet + OpenStreetMap integration will display dealer locations,
              service radius circles, and demand heatmaps here.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dealers.filter((d: any) => d.status === "active").map((dealer: any) => (
          <div key={dealer.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-4 hover-lift shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                {dealer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{dealer.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {dealer.address.village} &middot; {dealer.serviceRadius} km radius
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
