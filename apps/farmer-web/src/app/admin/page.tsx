"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@cultivator/ui/auth-context";
import {
  Sprout, Store, Map, Package, BarChart3, Users, Phone,
  ArrowRight, CheckCircle, Shield, Globe, TrendingUp, Menu, X
} from "lucide-react";

const features = [
  { icon: Store, title: "Dealer Network", desc: "Manage and monitor your entire dealer network from a single dashboard" },
  { icon: Map, title: "Network Map", desc: "Visualize dealer locations, coverage areas, and service gaps on an interactive map" },
  { icon: Package, title: "Product Catalog", desc: "Centralized product management with Telugu translations and dealer pricing" },
  { icon: BarChart3, title: "Analytics & Reports", desc: "Deep insights into dealer performance, product demand, and regional trends" },
  { icon: Users, title: "Farmer Reach", desc: "Track farmer engagement across your dealer network" },
  { icon: TrendingUp, title: "Growth Tracking", desc: "Monitor business growth with real-time KPIs and trend analysis" },
];

export default function AdminLandingPage() {
  const { isAuthenticated } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--color-surface-elevated)]/80 backdrop-blur-xl border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-text-primary)] flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text-primary)]">Cultivator</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-3 py-2">
              Farmer App
            </Link>
            <Link href="/dealer" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-3 py-2">
              Dealer Portal
            </Link>
            {isAuthenticated ? (
              <Link href="/admin/dashboard" className="h-10 px-5 bg-[var(--color-text-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/admin/login" className="h-10 px-5 bg-[var(--color-text-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                Admin Login <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-muted)]">
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-[var(--color-border-light)] px-4 py-3 space-y-2">
            <Link href="/" className="block py-2 text-sm font-medium text-[var(--color-text-secondary)]">Farmer App</Link>
            <Link href="/dealer" className="block py-2 text-sm font-medium text-[var(--color-text-secondary)]">Dealer Portal</Link>
            <Link href={isAuthenticated ? "/admin/dashboard" : "/admin/login"} className="block h-10 px-5 bg-[var(--color-text-primary)] text-white text-sm font-bold rounded-xl text-center leading-10">
              {isAuthenticated ? "Dashboard" : "Admin Login"}
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-[var(--color-primary)]/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900/10 text-[var(--color-text-primary)] rounded-full text-xs font-bold mb-6">
              <Shield className="w-3.5 h-3.5" />
              Enterprise Dashboard
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight">
              Manage Your
              <span className="bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-primary)] bg-clip-text text-transparent"> Agricultural Empire</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              Full visibility into your dealer network, product catalog, and farmer reach — all in one powerful enterprise platform built for Telangana.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/admin/login"
                className="h-12 px-8 bg-[var(--color-text-primary)] text-white text-sm font-bold rounded-xl hover:shadow-xl transition-all flex items-center gap-2"
              >
                Access Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="h-12 px-8 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-bold rounded-xl hover:bg-[var(--color-surface-muted)] transition-all flex items-center gap-2"
              >
                View Farmer App
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Multi-dealer management</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Real-time analytics</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Network mapping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--color-border-light)] bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "2", label: "Districts Covered" },
            { value: "6+", label: "Active Dealers" },
            { value: "2,300+", label: "Farmers Reached" },
            { value: "100%", label: "Telugu Support" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-[var(--color-text-primary)]">{s.value}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)]">Enterprise Control Center</h2>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-lg mx-auto">
            Everything you need to manage your agricultural distribution network
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 hover:shadow-lg hover:border-[var(--color-text-primary)]/10 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-text-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-text-primary)]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[var(--color-text-primary)]" />
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[var(--color-text-primary)] to-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Take Control?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Access your enterprise dashboard and start managing your dealer network.
          </p>
          <Link
            href="/admin/login"
            className="h-12 px-8 bg-white text-[var(--color-text-primary)] text-sm font-bold rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            Open Admin Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[var(--color-text-primary)]" />
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Cultivator</span>
            <span className="text-xs text-[var(--color-text-muted)]">&copy; 2026</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <Link href="/" className="hover:text-[var(--color-text-primary)]">Farmer App</Link>
            <Link href="/dealer" className="hover:text-[var(--color-text-primary)]">Dealer Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
