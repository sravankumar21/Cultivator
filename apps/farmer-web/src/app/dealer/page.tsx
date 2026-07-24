"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@cultivator/ui/auth-context";
import {
  Sprout, Phone, ShoppingCart, Package, Users, Truck,
  BarChart3, ArrowRight, CheckCircle, Star, Shield, Menu, X
} from "lucide-react";

const features = [
  { icon: Phone, title: "Smart Call Routing", desc: "Connect with nearby farmers instantly through AI-powered call routing" },
  { icon: ShoppingCart, title: "Order Management", desc: "Track and manage orders from farmers in your service area" },
  { icon: Package, title: "Inventory Control", desc: "Real-time stock levels with low-stock alerts and restocking" },
  { icon: Users, title: "Customer Database", desc: "Build and manage your farmer customer relationships" },
  { icon: Truck, title: "Delivery Tracking", desc: "Schedule and track deliveries to farmers" },
  { icon: BarChart3, title: "Business Analytics", desc: "Insights into sales, top products, and customer trends" },
];

export default function DealerLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--color-surface-elevated)]/80 backdrop-blur-xl border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text-primary)]">Cultivator</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-3 py-2">
              Farmer App
            </Link>
            <Link href="/admin" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-3 py-2">
              Enterprise
            </Link>
            {isAuthenticated ? (
              <Link href="/dealer/dashboard" className="h-10 px-5 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all flex items-center gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/dealer/login" className="h-10 px-5 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all flex items-center gap-2">
                Dealer Login <ArrowRight className="w-4 h-4" />
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
            <Link href="/admin" className="block py-2 text-sm font-medium text-[var(--color-text-secondary)]">Enterprise</Link>
            <Link href={isAuthenticated ? "/dealer/dashboard" : "/dealer/login"} className="block h-10 px-5 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl text-center leading-10">
              {isAuthenticated ? "Dashboard" : "Dealer Login"}
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-emerald-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-bold mb-6">
              <Shield className="w-3.5 h-3.5" />
              Dealer Portal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight">
              Grow Your
              <span className="text-[var(--color-primary)]"> Agricultural Business</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              Manage orders, inventory, customers, and deliveries — all from one powerful dashboard built for agricultural dealers in Telangana.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dealer/login"
                className="h-12 px-8 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-xl hover:shadow-[var(--color-primary)]/25 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="h-12 px-8 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-bold rounded-xl hover:bg-[var(--color-surface-muted)] transition-all flex items-center gap-2"
              >
                View Farmer App
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free to use</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Telugu support</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Real-time analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[var(--color-border-light)] bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "6+", label: "Dealer Partners" },
            { value: "500+", label: "Farmers Connected" },
            { value: "50+", label: "Products Listed" },
            { value: "4.5", label: "Avg Rating" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-[var(--color-primary)]">{s.value}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)]">Everything You Need</h2>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-lg mx-auto">
            A complete toolkit to manage your agricultural supply business
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Start?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Log in to your dealer dashboard and start managing your business today.
          </p>
          <Link
            href="/dealer/login"
            className="h-12 px-8 bg-white text-[var(--color-primary)] text-sm font-bold rounded-xl hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            Open Dealer Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-light)] bg-[var(--color-surface-elevated)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Cultivator</span>
            <span className="text-xs text-[var(--color-text-muted)]">&copy; 2026</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <Link href="/" className="hover:text-[var(--color-text-primary)]">Farmer App</Link>
            <Link href="/admin" className="hover:text-[var(--color-text-primary)]">Enterprise</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
