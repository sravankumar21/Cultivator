"use client";

import { useState } from "react";
import { useCalls } from "@cultivator/ui";
import { formatDuration, formatDateTime, formatPhone } from "@cultivator/utils";
import { PageHeader, FilterTabs, StatusBadge, LoadingPage, EmptyState, ErrorState } from "@cultivator/ui";
import { Phone, PhoneOff, Clock, User, StickyNote, ShoppingCart, RefreshCw, PhoneIncoming, PhoneOutgoing, Radio, Voicemail } from "lucide-react";
import { useAuth } from "@cultivator/ui/auth-context";

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  completed: { icon: Phone, color: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200", label: "Connected" },
  missed: { icon: PhoneOff, color: "bg-red-50 text-red-600 ring-1 ring-red-200", label: "Missed" },
  in_progress: { icon: Radio, color: "bg-blue-50 text-blue-600 ring-1 ring-blue-200", label: "In Progress" },
  voicemail: { icon: Voicemail, color: "bg-amber-50 text-amber-600 ring-1 ring-amber-200", label: "Voicemail" },
};

export default function CallsPage() {
  const { user } = useAuth();
  const DEALER_ID = (user as any)?.dealerId || "dlr-001";
  const [filter, setFilter] = useState<"all" | "completed" | "missed">("all");
  const { data: allCalls, loading, error } = useCalls({ dealerId: DEALER_ID });
  const calls = allCalls || [];

  const filteredCalls = filter === "all" ? calls : calls.filter((c: any) => c.status === filter);
  const missedCount = calls.filter((c: any) => c.status === "missed").length;
  const completedCount = calls.filter((c: any) => c.status === "completed").length;
  const totalDuration = calls.reduce((sum: number, c: any) => sum + (c.duration || 0), 0);

  if (loading) return <LoadingPage message="Loading calls..." />;
  if (error) return <ErrorState description={error} action={<button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>} />;

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Calls"
        description={`${filteredCalls.length} calls · ${completedCount} connected · ${missedCount} missed`}
        action={
          <FilterTabs
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: calls.length },
              { value: "completed", label: "Connected", count: completedCount },
              { value: "missed", label: "Missed", count: missedCount },
            ]}
          />
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border-light)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Total Calls</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{calls.length}</p>
        </div>
        <div className="bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border-light)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <PhoneOff className="w-4 h-4 text-red-500" />
            <span className="text-xs text-[var(--color-text-muted)]">Missed</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{missedCount}</p>
        </div>
        <div className="bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border-light)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-[var(--color-text-muted)]">Talk Time</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{formatDuration(totalDuration)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredCalls.length === 0 ? (
          <EmptyState icon={<Phone className="w-8 h-8" />} title="No calls found" description="No calls match your current filter" />
        ) : filteredCalls.map((call: any) => {
          const config = statusConfig[call.status] || statusConfig.completed;
          const StatusIcon = config.icon;
          return (
            <div key={call.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-4 hover-lift shadow-sm">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${config.color}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[var(--color-text-primary)] text-sm">
                      {call.farmerName || formatPhone(call.farmerPhone)}
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${config.color}`}>
                      {config.label}
                    </span>
                    {call.type === "incoming" && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded-full flex items-center gap-0.5">
                        <PhoneIncoming className="w-2.5 h-2.5" /> In
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {formatPhone(call.farmerPhone)}
                    </span>
                    <span>{formatDateTime(call.createdAt)}</span>
                    {call.duration > 0 && (
                      <span className="font-mono font-semibold">{formatDuration(call.duration)}</span>
                    )}
                  </div>
                  {call.notes && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-2 bg-[var(--color-surface)] rounded-lg px-3 py-2 border border-[var(--color-border-light)] truncate">
                      {call.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={`tel:${call.farmerPhone.replace(/\D/g, "")}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                  {call.status === "completed" && (
                    <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
