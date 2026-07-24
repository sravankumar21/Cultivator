"use client";

import { useState } from "react";
import { useCalls } from "@cultivator/ui";
import { formatDuration, formatDateTime } from "@cultivator/utils";
import { PageHeader, FilterTabs, StatusBadge } from "@cultivator/ui";
import { Phone, PhoneOff, Clock, User, StickyNote, ShoppingCart } from "lucide-react";

const DEALER_ID = "dlr-001";

export default function CallsPage() {
  const [filter, setFilter] = useState<"all" | "completed" | "missed">("all");
  const { data: allCalls } = useCalls({ dealerId: DEALER_ID });
  const calls = allCalls || [];

  const filteredCalls = filter === "all" ? calls : calls.filter((c: any) => c.status === filter);
  const missedCount = calls.filter((c: any) => c.status === "missed").length;

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PageHeader
        title="Calls"
        description={`${filteredCalls.length} calls total`}
        action={
          <FilterTabs
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: calls.length },
              { value: "completed", label: "Completed" },
              { value: "missed", label: "Missed", count: missedCount },
            ]}
          />
        }
      />

      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <div key={call.id} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-5 hover-lift shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  call.status === "missed"
                    ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                    : "bg-[var(--color-primary-50)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary-100)]"
                }`}>
                  {call.farmerName?.charAt(0) || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[var(--color-text-primary)]">
                      {call.farmerName || call.farmerPhone}
                    </h3>
                    <StatusBadge status={call.status} />
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {call.farmerPhone}
                  </p>
                  {call.notes && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2 bg-[var(--color-surface)] rounded-xl p-3 border border-[var(--color-border-light)]">
                      &ldquo;{call.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDateTime(call.createdAt).split(", ").slice(1).join(", ")}
                </p>
                {call.duration > 0 && (
                  <p className="text-sm font-mono font-semibold text-[var(--color-text-secondary)] mt-1">
                    {formatDuration(call.duration)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--color-border-light)]">
              <a
                href={`tel:${call.farmerPhone.replace(/\D/g, "")}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Back
              </a>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                <StickyNote className="w-3.5 h-3.5" />
                Add Note
              </button>
              {call.status === "completed" && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-border)] transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Create Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
