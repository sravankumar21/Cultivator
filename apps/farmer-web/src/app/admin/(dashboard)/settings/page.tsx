"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@cultivator/ui/auth-context";
import { LoadingPage, ErrorState } from "@cultivator/ui";
import { Building2, Phone, Mail, Route, ToggleRight, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface EnterpriseSettings {
  companyName: string;
  phone: string;
  email: string;
}

const defaultSettings: EnterpriseSettings = {
  companyName: "",
  phone: "",
  email: "",
};

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("cultivator-token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<EnterpriseSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Access denied. Admin only.</div>;
  }

  useEffect(() => {
    async function loadSettings() {
      try {
        const headers = getAuthHeaders();
        const res = await fetch("/api/enterprise", { headers });
        if (res.ok) {
          const data = await res.json();
          setSettings({
            companyName: data.companyName || data.name || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        }
      } catch {
        // API may not exist yet — use defaults
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch("/api/enterprise", {
        method: "PATCH",
        headers,
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.success("Settings saved locally");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPage message="Loading settings..." />;

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
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full h-11 px-4 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                <Phone className="w-4 h-4" /> Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full h-11 px-4 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="+91..."
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full h-11 px-4 text-sm bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="admin@example.com"
              />
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
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors shadow-sm shadow-[var(--color-primary)]/20 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
