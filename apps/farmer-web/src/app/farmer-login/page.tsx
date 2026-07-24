"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@cultivator/ui/auth-context";
import { Sprout, Phone, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export default function FarmerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3003/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.startsWith("+91") ? phone : `+91${phone}` }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const fullPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
      const res = await fetch("http://localhost:3003/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, otp }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      login(data.token, data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
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

      <div className="relative w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Cultivator</span>
        </Link>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
          {step === "phone" ? (
            <form onSubmit={handleSendOTP}>
              <h1 className="text-xl font-bold text-white mb-2 text-center">Welcome, Farmer</h1>
              <p className="text-sm text-white/60 mb-6 text-center">Enter your mobile number to get started</p>

              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/60 text-sm font-medium">
                  <Phone className="w-4 h-4" />
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  placeholder="98765 43210"
                  className="w-full h-14 pl-16 pr-4 text-lg font-medium bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-300 text-sm mb-4 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full h-14 bg-white text-[var(--color-primary-dark)] text-base font-bold rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Change number
              </button>

              <h1 className="text-xl font-bold text-white mb-2 text-center">Verify OTP</h1>
              <p className="text-sm text-white/60 mb-6 text-center">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-white">+91 {phone}</span>
              </p>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                  placeholder="000000"
                  className="w-full h-14 px-4 text-2xl font-mono font-bold text-center bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 tracking-[0.5em] transition-all"
                  autoFocus
                  maxLength={6}
                />
              </div>

              {error && <p className="text-red-300 text-sm mb-4 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-14 bg-white text-[var(--color-primary-dark)] text-base font-bold rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl"
              >
                {loading ? "Verifying..." : "Verify & Login"}
                {!loading && <CheckCircle className="w-5 h-5" />}
              </button>

              <p className="text-xs text-white/40 text-center mt-4">
                Didn&apos;t receive the OTP?{" "}
                <button type="button" onClick={handleSendOTP} className="text-white/70 hover:text-white underline">
                  Resend
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="text-xs text-white/40 text-center mt-6">
          Are you a dealer or admin?{" "}
          <Link href="/login" className="text-white/70 hover:text-white underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
