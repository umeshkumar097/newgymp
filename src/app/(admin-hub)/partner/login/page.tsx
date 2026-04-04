"use client";

import React, { useState } from "react";
import { Store, Phone, ArrowRight, ShieldCheck, Loader2, ArrowLeft, Zap, Mail, Lock, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Premium Light Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-green/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-green/5 blur-[120px] rounded-full animate-pulse delay-1000" />

      <div className="w-full max-w-md space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white shadow-2xl shadow-slate-200/50 border border-slate-50 mb-2 group hover:scale-110 transition-all duration-500">
            <Store size={32} className="text-brand-green transition-transform group-hover:rotate-12" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black font-heading text-slate-900 tracking-tighter uppercase leading-none italic">
                PassFit <span className="text-brand-green">Partner</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] pl-1">Gym Management Access</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-3xl border border-white rounded-[3.5rem] p-12 shadow-3xl shadow-slate-200/50 space-y-10">
          
          {/* Auth Mode Toggle */}
          {step === "PHONE" && (
            <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
              {["OTP", "PASSWORD"].map((mode) => (
                <button 
                  key={mode}
                  onClick={() => { setAuthMode(mode as any); setError(null); }}
                  className={cn(
                    "flex-1 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
                    authMode === mode ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {mode === "OTP" ? "OTP Login" : "Security Pwd"}
                </button>
              ))}
            </div>
          )}

          {step === "PHONE" ? (
            authMode === "OTP" ? (
              <form onSubmit={handleSendOtp} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Partner WhatsApp</label>
                  <div className="flex items-center space-x-5 bg-slate-50 border border-slate-100 p-6 rounded-[1.5rem] focus-within:bg-white focus-within:border-brand-green/30 focus-within:shadow-lg transition-all group">
                    <Phone size={20} className="text-slate-300 group-focus-within:text-brand-green transition-colors" />
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="84494 88090" 
                      className="bg-transparent border-none outline-none text-sm font-extrabold text-slate-900 w-full placeholder:text-slate-200"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed animate-shake">
                    {error}
                  </div>
                )}

                <button 
                   type="submit"
                   disabled={isPending || phoneNumber.length < 10}
                   className="w-full bg-slate-900 text-white font-black py-7 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-[11px] uppercase tracking-[0.3em] overflow-hidden group shadow-slate-200/50"
                >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span className="relative z-10">Request Access Code</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordLogin} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Partner Email</label>
                  <div className="flex items-center space-x-5 bg-slate-50 border border-slate-100 p-6 rounded-[1.5rem] focus-within:bg-white focus-within:border-brand-green/30 focus-within:shadow-lg transition-all shadow-sm">
                    <Mail size={20} className="text-slate-300" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="GYM@PASSFIT.IN" 
                      className="bg-transparent border-none outline-none text-sm font-extrabold text-slate-900 w-full placeholder:text-slate-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Security ID</label>
                  <div className="flex items-center space-x-5 bg-slate-50 border border-slate-100 p-6 rounded-[1.5rem] focus-within:bg-white focus-within:border-brand-green/30 focus-within:shadow-lg transition-all shadow-sm">
                    <Lock size={20} className="text-slate-300" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="bg-transparent border-none outline-none text-sm font-extrabold text-slate-900 w-full placeholder:text-slate-200"
                      required
                    />
                  </div>
                </div>

                {error && (
                   <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed">
                     {error}
                   </div>
                )}

                <button 
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-slate-900 text-white font-black py-7 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-[11px] uppercase tracking-[0.3em] shadow-slate-200/50"
                >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>Enter Dashboard</span>
                      <Zap size={18} className="text-brand-green fill-brand-green" />
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center text-center">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 italic">Verify Identity</h2>
                  <button type="button" onClick={() => setStep("PHONE")} className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] flex items-center hover:scale-105 transition-all">
                    <ArrowLeft size={14} className="mr-2" />
                    Change
                  </button>
               </div>
               
               <div className="relative group">
                   <input 
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                      placeholder="0000" 
                      maxLength={4} 
                      autoFocus
                      className="w-full bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2rem] text-6xl text-center font-black text-slate-900 tracking-[0.5em] outline-none placeholder:text-slate-100 focus:bg-white focus:border-brand-green focus:border-solid transition-all" 
                   />
                   <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-slate-100 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-brand-green transition-colors">
                       SENT VIA WHATSAPP
                   </div>
               </div>

               {error && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black text-center uppercase tracking-widest leading-relaxed">
                    {error}
                  </div>
               )}

               <button 
                  type="submit"
                  disabled={isPending || otp.length !== 4}
                  className="w-full bg-slate-900 text-white font-black py-7 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em] shadow-slate-200/50"
               >
                  {isPending ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      <span>Open Hub</span>
                      <ShieldCheck size={20} className="text-brand-green" />
                    </>
                  )}
               </button>
            </form>
          )}
        </div>

        <div className="flex flex-col items-center space-y-6 pt-4">
             <div className="flex items-center space-x-6">
                 <div className="h-[1px] w-12 bg-slate-200" />
                 <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">Secure Hub v3.5</p>
                 <div className="h-[1px] w-12 bg-slate-200" />
             </div>
             
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2 opacity-50">
                 <Lock size={10} />
                 <span>Aiclex Enterprise Port ⚡</span>
             </div>
        </div>
      </div>
    </div>
  );
}
