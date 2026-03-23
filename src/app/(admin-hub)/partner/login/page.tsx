"use client";

import React, { useState } from "react";
import { Store, Phone, ArrowRight, ShieldCheck, Loader2, ArrowLeft, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [authMode, setAuthMode] = useState<"OTP" | "PASSWORD">("OTP");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    
    setError(null);
    setIsPending(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, role: "GYM_OWNER" }),
      });
      const data = await res.json();
      if (data.success) setStep("OTP");
      else setError(data.error);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError(null);
    setIsPending(true);
    try {
      const res = await fetch("/api/auth/login-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/partner/dashboard");
        router.refresh();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/partner/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Brand Gradients */}
      <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-brand-green/5 blur-[150px] rounded-full" />
      <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-brand-blue/5 blur-[150px] rounded-full" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-brand-green shadow-2xl shadow-brand-green/20 mb-2">
            <Store size={28} className="text-[#0F172A]" />
          </div>
          <h1 className="text-4xl font-extrabold font-heading text-white tracking-tighter uppercase leading-none">
            PassFit <span className="text-brand-green">Partner</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Gym Management Access</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
          
          {/* Auth Mode Toggle */}
          {step === "PHONE" && (
            <div className="flex p-1 bg-slate-950 border border-white/5 rounded-2xl">
              <button 
                onClick={() => setAuthMode("OTP")}
                className={cn(
                  "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                  authMode === "OTP" ? "bg-brand-green text-[#0F172A]" : "text-slate-500"
                )}
              >
                OTP Mode
              </button>
              <button 
                onClick={() => setAuthMode("PASSWORD")}
                className={cn(
                  "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                  authMode === "PASSWORD" ? "bg-white text-[#0F172A]" : "text-slate-500"
                )}
              >
                Password
              </button>
            </div>
          )}

          {step === "PHONE" ? (
            authMode === "OTP" ? (
              <form onSubmit={handleSendOtp} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1">Partner WhatsApp</label>
                  <div className="flex items-center space-x-4 bg-white/5 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
                    <Phone size={18} className="text-slate-700" />
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter Phone Number" 
                      className="bg-transparent border-none outline-none text-sm font-bold text-white w-full"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-widest leading-relaxed">{error}</div>}

                <button 
                  type="submit"
                  disabled={isPending || phoneNumber.length < 10}
                  className="w-full bg-brand-green text-[#0F172A] font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>Secure Access</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1">Email / Partner ID</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@passfit.in" 
                    className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-white/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-white/20 transition-all"
                    required
                  />
                </div>

                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-widest leading-relaxed">{error}</div>}

                <button 
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-white text-[#0F172A] font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>Partner Login</span>
                      <Zap size={18} />
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
               <div className="flex justify-between items-center">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Security Code</h2>
                  <button type="button" onClick={() => setStep("PHONE")} className="text-[10px] font-bold text-brand-green uppercase tracking-widest flex items-center">
                    <ArrowLeft size={12} className="mr-1" />
                    Back
                  </button>
               </div>
               
               <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  placeholder="0000" 
                  maxLength={4} 
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 p-8 rounded-2xl text-5xl text-center font-bold text-brand-green tracking-[0.4em] outline-none placeholder:text-slate-800" 
               />

               {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold text-center uppercase tracking-widest leading-relaxed">{error}</div>}

               <button 
                  type="submit"
                  disabled={isPending || otp.length !== 4}
                  className="w-full bg-white text-[#0F172A] font-bold py-5 rounded-2xl shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-widest"
               >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>Open Dashboard</span>
                      <ShieldCheck size={18} />
                    </>
                  )}
               </button>
            </form>
          )}
        </div>

        <p className="text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.5em]">
          Version 3.5.0 • Aiclex Enterprise
        </p>
      </div>
    </div>
  );
}
