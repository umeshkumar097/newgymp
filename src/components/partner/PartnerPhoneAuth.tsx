"use client";

import React, { useState, useTransition } from "react";
import { Phone, ArrowRight, ShieldCheck, Loader2, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerPhoneAuthProps {
  onSuccess: (phone: string) => void;
}

export function PartnerPhoneAuth({ onSuccess }: PartnerPhoneAuthProps) {
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Enter valid phone");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber }),
        });
        if (res.ok) setStep("OTP");
        else setError("Failed to send code");
      } catch (err) {
        setError("Error occurred");
      }
    });
  };

  const handleVerifyOtp = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, otp, mode: "register" }),
        });
        const data = await res.json();
        if (data.success) {
          onSuccess(phoneNumber);
        } else {
          setError(data.error || "Invalid code");
        }
      } catch (err) {
        setError("Verification failed");
      }
    });
  };

  return (
    <div className="space-y-6">
      {step === "PHONE" ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 bg-zinc-950 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
            <Phone size={18} className="text-zinc-700" />
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="WhatsApp Phone Number" className="bg-transparent border-none outline-none text-sm font-bold text-white w-full" maxLength={10} />
          </div>
          {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}
          <button onClick={handleSendOtp} disabled={isPending} className="w-full bg-brand-green text-zinc-950 font-black py-4 rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition-all text-xs uppercase tracking-widest">
            {isPending ? <Loader2 className="animate-spin" size={16} /> : <><span>Get Access Code</span><ArrowRight size={16} /></>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 bg-zinc-950 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
            <ShieldCheck size={18} className="text-zinc-700" />
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="0000" className="bg-transparent border-none outline-none text-xl font-black text-brand-green w-full tracking-[0.5em] text-center" maxLength={4} />
          </div>
          {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setStep("PHONE")} className="p-4 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><ArrowLeft size={16} /></button>
            <button onClick={handleVerifyOtp} disabled={isPending || otp.length !== 4} className="flex-1 bg-white text-zinc-950 font-black py-4 rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition-all text-xs uppercase tracking-widest">
              {isPending ? <Loader2 className="animate-spin" size={16} /> : <><span>Verify Code</span><Check size={16} /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
