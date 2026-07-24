"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { Sprout, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

export function FarmerFooter() {
  const { t } = useI18n();

  return (
    <footer className="relative bg-[var(--color-section-deep)] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-primary)] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--color-accent)] blur-3xl" />
      </div>

      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">{t.brand}</span>
              </Link>
              <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-6">
                {t.footer.description}
              </p>
              <div className="flex items-center gap-4">
                <a href="tel:+919876500000" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  +91 98765 00000
                </a>
                <a href="mailto:hello@cultivator.in" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  hello@cultivator.in
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">{t.footer.quickLinks}</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/dealers/nearby" className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                    {t.footer.findDealers}
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors">
                    {t.footer.browseProducts}
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-white/50">{t.footer.about}</span>
                </li>
                <li>
                  <span className="text-sm text-white/50">{t.footer.contact}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">{t.footer.legal}</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-sm text-white/50">{t.footer.terms}</span>
                </li>
                <li>
                  <span className="text-sm text-white/50">{t.footer.privacy}</span>
                </li>
              </ul>
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-white mb-3">{t.footer.serviceArea}</h3>
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <MapPin className="w-4 h-4" />
                  Telangana, India
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Cultivator Agriculture Pvt Ltd. {t.footer.copyright}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Twitter</a>
              <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">LinkedIn</a>
              <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
