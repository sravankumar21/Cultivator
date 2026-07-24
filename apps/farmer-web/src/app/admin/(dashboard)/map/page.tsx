"use client";

import { useDealers } from "@cultivator/ui";
import { useAuth } from "@cultivator/ui/auth-context";
import { LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { MapPin, Store, RefreshCw, ExternalLink } from "lucide-react";

export default function MapPage() {
  const { user } = useAuth();
  const { data: allDealers, loading, error } = useDealers();
  const dealers = (allDealers || []) as any[];

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Access denied. Admin only.</div>;
  }

  if (loading) return <LoadingPage message="Loading map..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" />Retry</button>} />;

  const activeDealers = dealers.filter((d: any) => d.status === "active");

  return (
    <div className="p-6 sm:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Dealer Locations</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {activeDealers.length} active dealers across the network
        </p>
      </div>

      {activeDealers.length === 0 ? (
        <EmptyState icon={<MapPin className="w-8 h-8" />} title="No dealers found" description="No active dealers to display" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDealers.map((dealer: any) => (
            <div key={dealer.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shadow-sm flex-shrink-0">
                  {dealer.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{dealer.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{dealer.address?.district}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dealer.address?.village}, {dealer.address?.district}</span>
                </div>
                {dealer.serviceRadius && (
                  <div className="text-xs text-[var(--color-text-muted)]">
                    Service radius: {dealer.serviceRadius} km
                  </div>
                )}
              </div>
              {dealer.address?.lat != null && dealer.address?.lng != null ? (
                <a
                  href={`https://www.google.com/maps?q=${dealer.address.lat},${dealer.address.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Google Maps
                </a>
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">No coordinates available</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
