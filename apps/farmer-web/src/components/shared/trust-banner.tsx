"use client";

import { useI18n } from "@/i18n/provider";
import { Store, Users, Headphones } from "lucide-react";

export function TrustBanner() {
  const { t } = useI18n();

  const stats = [
    { value: "500+", label: t.trust.dealers, icon: Store },
    { value: "10,000+", label: t.trust.farmers, icon: Users },
    { value: "24/7", label: t.trust.support, icon: Headphones },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0a2e1a 0%, #14532d 30%, #15803d 70%, #1a6b3f 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(34, 197, 94, 0.2)" }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(234, 179, 8, 0.12)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                <stat.icon className="w-7 h-7 text-white/80" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-white/60 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
