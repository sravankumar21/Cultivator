"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useAuth } from "@cultivator/ui/auth-context";
import { Sprout, MapPin, Package, Globe, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";

export function FarmerNav() {
  const { t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-md shadow-[var(--color-primary)]/25 group-hover:shadow-lg group-hover:shadow-[var(--color-primary)]/35 transition-shadow">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {t.brand}
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/dealers/nearby"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] rounded-xl transition-all duration-200"
          >
            <MapPin className="w-4 h-4" />
            {t.nav.dealers}
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] rounded-xl transition-all duration-200"
          >
            <Package className="w-4 h-4" />
            {t.nav.shop}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--color-text-secondary)]">
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/farmer-login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--color-primary)] text-white hover:shadow-lg hover:shadow-[var(--color-primary)]/25 transition-all duration-200 ml-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}

          <LanguageSwitcher />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 rounded-xl hover:bg-[var(--color-surface-muted)] transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--color-border-light)] bg-[var(--color-surface-elevated)] animate-fade-in-down">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/dealers/nearby"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] rounded-xl transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {t.nav.dealers}
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] rounded-xl transition-colors"
            >
              <Package className="w-4 h-4" />
              {t.nav.shop}
            </Link>

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)]">
                  <User className="w-4 h-4" />
                  {user?.name}
                </div>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/farmer-login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}

            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "te" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary)] hover:bg-[var(--color-primary-100)] border border-[var(--color-primary-100)] transition-all duration-200"
    >
      <Globe className="w-3.5 h-3.5" />
      {language === "en" ? "తెలుగు" : "EN"}
    </button>
  );
}
