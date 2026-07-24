"use client";

import { Building2, Phone, Mail, Route, ToggleRight, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-base font-bold">Enterprise Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Company Name</label>
              <input type="text" defaultValue="Cultivator Agriculture Pvt Ltd" className="w-full h-11 px-4 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-200" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                <Phone className="w-4 h-4" /> Phone
              </label>
              <input type="tel" defaultValue="+919876500000" className="w-full h-11 px-4 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-200" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input type="email" defaultValue="admin@cultivator.in" className="w-full h-11 px-4 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-200" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Route className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-base font-bold">Call Routing</h2>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mb-5">
            Configure how farmer calls are routed to dealers.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-xl">
              <div>
                <p className="text-sm font-semibold">Nearest Dealer Matching</p>
                <p className="text-xs text-[var(--color-text-muted)]">Route calls to the nearest dealer based on farmer location</p>
              </div>
              <ToggleRight className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-xl">
              <div>
                <p className="text-sm font-semibold">Load Balancing</p>
                <p className="text-xs text-[var(--color-text-muted)]">Distribute calls evenly across available dealers</p>
              </div>
              <ToggleRight className="w-6 h-6 text-[var(--color-text-muted)]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
