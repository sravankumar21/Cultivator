"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@cultivator/ui/auth-context";
import { savePushToken } from "@/lib/push";
import { Sprout, Mail, Lock, ArrowRight, Phone, Store } from "lucide-react";

export default function DealerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      login(data.data.token, data.data.user);
      savePushToken(data.data.user.id, "dealer");
      router.push("/dealer/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-surface)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/dealer" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">Cultivator</span>
          </Link>
        </div>

        <div className="bg-[var(--color-surface-elevated)] rounded-3xl border border-[var(--color-border-light)] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-[var(--color-primary)]" />
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Dealer Login</h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">Sign in to manage your agricultural business</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  className="w-full h-12 pl-11 pr-4 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" autoFocus />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-4 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <button type="submit" disabled={loading || !email || !password}
              className="w-full h-12 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[var(--color-surface-muted)] rounded-xl">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-1">Demo: dealer@lakshmi.com / dealer123</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[var(--color-text-muted)]">
          <Link href="/admin/login" className="hover:text-[var(--color-text-primary)]">Admin Login</Link>
          <span>&middot;</span>
          <Link href="/farmer-login" className="hover:text-[var(--color-text-primary)]">Farmer Login</Link>
          <span>&middot;</span>
          <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        </div>
      </div>
    </div>
  );
}
