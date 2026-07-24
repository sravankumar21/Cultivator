"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { Phone, MapPin, ArrowRight } from "lucide-react";

export default function CallPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"connecting" | "ringing" | "active">("connecting");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus("ringing"), 2000);
    const timer2 = setTimeout(() => setStatus("active"), 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0a2e1a 0%, #14532d 30%, #15803d 70%, #1a6b3f 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-[10%] w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(234, 179, 8, 0.1)" }} />
      </div>

      <div className="text-center max-w-sm w-full relative">
        <div className="mb-10">
          <p className="text-white/50 text-sm mb-3 font-medium">{t.call.connecting}</p>
          <h1 className="text-3xl font-bold text-white mb-2">Sri Lakshmi Agro</h1>
          <p className="text-white/50 text-sm flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            3.2 km away
          </p>
        </div>

        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-10 relative">
          {status === "active" && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping-slow" />
              <div className="absolute inset-[-8px] rounded-full border border-white/5 animate-pulse" />
            </>
          )}
          <div className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center ${status === "ringing" ? "animate-bounce" : ""}`}>
            <Phone className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mb-10">
          {status === "connecting" && (
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
              <span className="text-white/70 text-sm font-medium">{t.call.connecting}</span>
            </div>
          )}
          {status === "ringing" && (
            <div className="flex items-center justify-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white/60 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2.5 h-2.5 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0.4s" }} />
              <span className="text-white/70 text-sm font-medium ml-2">{t.call.ringing}</span>
            </div>
          )}
          {status === "active" && (
            <p className="text-white font-mono text-2xl font-bold tracking-wider">{formatDuration(duration)}</p>
          )}
        </div>

        <div className="space-y-3">
          <button className="w-full h-14 bg-red-500 text-white text-base font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25 active:scale-[0.97]">
            {t.call.endCall}
          </button>
          <Link
            href="/dealers/nearby"
            className="flex items-center justify-center gap-2 w-full h-12 glass-dark text-white/80 text-sm font-medium rounded-xl hover:bg-white/20 transition-colors"
          >
            {t.call.needDifferent}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
