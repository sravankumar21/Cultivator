"use client";

import Link from "next/link";
import { Sprout, Store, Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-surface)]">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">Cultivator</span>
          </Link>
        </div>

        <h1 className="text-xl font-bold text-[var(--color-text-primary)] text-center mb-6">Choose your portal</h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/dealer/login"
            className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all group text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-primary)]/20 transition-colors">
              <Store className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <h2 className="font-bold text-[var(--color-text-primary)] mb-1">Dealer Portal</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Manage orders, inventory & customers</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
              Login <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/admin/login"
            className="bg-[var(--color-surface-elevated)] rounded-2xl border border-[var(--color-border-light)] p-6 hover:shadow-lg hover:border-[var(--color-text-primary)]/10 transition-all group text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-text-primary)]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--color-text-primary)]/20 transition-colors">
              <Shield className="w-7 h-7 text-[var(--color-text-primary)]" />
            </div>
            <h2 className="font-bold text-[var(--color-text-primary)] mb-1">Admin Dashboard</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Manage dealer network & analytics</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-text-primary)]">
              Login <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <p className="text-xs text-[var(--color-text-muted)] text-center mt-6">
          Are you a farmer?{" "}
          <Link href="/farmer-login" className="text-[var(--color-primary)] hover:underline font-medium">
            Login with mobile
          </Link>
        </p>
      </div>
    </div>
  );
}
