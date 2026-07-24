"use client";

import { useI18n } from "@/i18n/provider";
import { Smartphone, Phone, MessageSquare, Sprout } from "lucide-react";

const icons = [Smartphone, Phone, MessageSquare, Sprout];
const bgGradients = [
  "from-emerald-500/10 to-teal-500/5",
  "from-green-500/10 to-emerald-500/5",
  "from-teal-500/10 to-cyan-500/5",
  "from-emerald-500/10 to-green-500/5",
];

export function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    { label: t.howItWorks.step1, desc: t.howItWorks.desc1 },
    { label: t.howItWorks.step2, desc: t.howItWorks.desc2 },
    { label: t.howItWorks.step3, desc: t.howItWorks.desc3 },
    { label: t.howItWorks.step4, desc: t.howItWorks.desc4 },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)] via-[var(--color-section-alt)] to-[var(--color-section-cool)]" />
      <div className="absolute inset-0 mesh-bg opacity-60" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)] bg-[var(--color-primary-50)] rounded-full mb-4 border border-[var(--color-primary-100)]">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[var(--color-primary-200)] via-[var(--color-primary-300)] to-[var(--color-primary-200)]" style={{ zIndex: -1 }} />

          {steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${bgGradients[i]} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 border border-[var(--color-primary-100)]/50`}>
                    <Icon className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/25">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
                  {step.label}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] max-w-[200px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
