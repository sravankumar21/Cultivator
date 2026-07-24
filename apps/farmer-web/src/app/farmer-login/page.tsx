"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@cultivator/ui/auth-context";
import { ArrowLeft, Phone, Lock, User, MapPin, Loader2 } from "lucide-react";

type Step = "phone" | "pin" | "setup-name" | "setup-pin";

export default function FarmerLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [farmerExists, setFarmerExists] = useState(false);

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) { setError("Enter 10-digit mobile number"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/pin/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setFarmerExists(data.data.exists);
      if (data.data.exists && data.data.hasPin) {
        setStep("pin");
      } else if (data.data.exists && !data.data.hasPin) {
        setStep("setup-name");
      } else {
        setStep("setup-name");
      }
    } catch (err: any) {
      setError(err.message || "Failed to check phone");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (pin.length !== 4) { setError("Enter 4-digit PIN"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin, action: "login" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      login(data.data.token, data.data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = () => {
    if (!name.trim()) { setError("Enter your name"); return; }
    setError("");
    setStep("setup-pin");
  };

  const handlePinSetup = async () => {
    if (pin.length !== 4) { setError("PIN must be 4 digits"); return; }
    if (pin !== confirmPin) { setError("PINs do not match"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin, name: name.trim(), village: village.trim() || undefined, action: "setup" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      login(data.data.token, data.data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0a2e1a 0%, #14532d 30%, #15803d 70%, #1a6b3f 100%)" }} />
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-[10%] w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(234, 179, 8, 0.1)" }} />
      </div>

      <div className="text-center max-w-sm w-full relative">
        {/* Step: Phone */}
        {step === "phone" && (
          <>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">Cultivator</h1>
              <p className="text-white/60 text-sm">Sign in with your mobile number</p>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm font-medium">Mobile Number</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                <span className="px-4 text-white/70 text-sm font-medium border-r border-white/20">+91</span>
                <input
                  type="tel" value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  placeholder="9876543210"
                  className="flex-1 h-12 px-4 bg-transparent text-white text-lg font-medium placeholder:text-white/30 outline-none"
                  maxLength={10}
                  autoFocus
                />
              </div>
            </div>
            {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
            <button onClick={handlePhoneSubmit} disabled={loading || phone.length !== 10}
              className="w-full h-13 bg-white text-[#15803d] text-base font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
            </button>
            <Link href="/" className="inline-block mt-6 text-white/50 text-sm hover:text-white/70 transition-colors">
              Back to home
            </Link>
          </>
        )}

        {/* Step: Enter PIN (returning farmer) */}
        {step === "pin" && (
          <>
            <div className="mb-10">
              <button onClick={() => { setStep("phone"); setPin(""); setError(""); }}
                className="flex items-center gap-1 text-white/50 text-sm mb-4 hover:text-white/70">
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-white/60 text-sm">Enter your 4-digit PIN for<br /><span className="font-semibold text-white">+91 {phone}</span></p>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                    pin.length > i ? "border-white bg-white/20 text-white" : "border-white/30 text-white/30"
                  }`}>
                    {pin.length > i ? "•" : ""}
                  </div>
                ))}
              </div>
              <input type="tel" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                className="absolute opacity-0 w-0 h-0" maxLength={4} autoFocus
                onFocus={() => {}} id="pin-input" />
              <label htmlFor="pin-input" className="block mt-4 text-center">
                <span className="text-white/50 text-xs">Tap the PIN boxes to type</span>
              </label>
              {/* Hidden input that's always focused */}
              <input type="tel" value={pin}
                onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                className="sr-only" maxLength={4} autoFocus
                aria-label="PIN" />
            </div>
            {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
            <button onClick={handleLogin} disabled={loading || pin.length !== 4}
              className="w-full h-13 bg-white text-[#15803d] text-base font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </>
        )}

        {/* Step: Setup name (new farmer) */}
        {step === "setup-name" && (
          <>
            <div className="mb-8">
              <button onClick={() => { setStep("phone"); setName(""); setVillage(""); setError(""); }}
                className="flex items-center gap-1 text-white/50 text-sm mb-4 hover:text-white/70">
                <ArrowLeft className="w-4 h-4" /> Change number
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">{farmerExists ? "Complete Profile" : "Create Account"}</h1>
              <p className="text-white/60 text-sm">for <span className="font-semibold text-white">+91 {phone}</span></p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5"><User className="w-3.5 h-3.5" /> Your Name</div>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="e.g. Ramaiah" autoFocus
                  className="w-full h-12 px-4 bg-white/10 text-white rounded-xl border border-white/20 placeholder:text-white/30 outline-none focus:border-white/50" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5"><MapPin className="w-3.5 h-3.5" /> Village (optional)</div>
                <input type="text" value={village} onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Domakonda"
                  className="w-full h-12 px-4 bg-white/10 text-white rounded-xl border border-white/20 placeholder:text-white/30 outline-none focus:border-white/50" />
              </div>
            </div>
            {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
            <button onClick={handleNameSubmit} disabled={!name.trim()}
              className="w-full h-13 bg-white text-[#15803d] text-base font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg active:scale-[0.97] disabled:opacity-50">
              Continue
            </button>
          </>
        )}

        {/* Step: Setup PIN (new farmer) */}
        {step === "setup-pin" && (
          <>
            <div className="mb-8">
              <button onClick={() => { setStep("setup-name"); setPin(""); setConfirmPin(""); setError(""); }}
                className="flex items-center gap-1 text-white/50 text-sm mb-4 hover:text-white/70">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">Set Your PIN</h1>
              <p className="text-white/60 text-sm">Choose a 4-digit PIN to sign in quickly</p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5"><Lock className="w-3.5 h-3.5" /> 4-Digit PIN</div>
                <input type="tel" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                  placeholder="••••" maxLength={4} autoFocus
                  className="w-full h-12 px-4 bg-white/10 text-white text-center text-2xl tracking-[0.5em] rounded-xl border border-white/20 placeholder:text-white/30 placeholder:tracking-normal outline-none focus:border-white/50" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5"><Lock className="w-3.5 h-3.5" /> Confirm PIN</div>
                <input type="tel" value={confirmPin} onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                  placeholder="••••" maxLength={4}
                  className="w-full h-12 px-4 bg-white/10 text-white text-center text-2xl tracking-[0.5em] rounded-xl border border-white/20 placeholder:text-white/30 placeholder:tracking-normal outline-none focus:border-white/50" />
              </div>
            </div>
            {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
            <button onClick={handlePinSetup} disabled={loading || pin.length !== 4 || confirmPin.length !== 4}
              className="w-full h-13 bg-white text-[#15803d] text-base font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Set PIN & Sign In"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
