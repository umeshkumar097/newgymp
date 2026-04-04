"use client";

import React, { useState } from "react";
import { Store, ArrowRight, ShieldCheck, Loader2, ArrowLeft, Zap, Mail, Lock, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"IDENTIFY" | "OTP">("IDENTIFY");
  const [authMode, setAuthMode] = useState<"OTP" | "PASSWORD">("OTP");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    
    setError(null);
    setIsPending(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "GYM_OWNER" }),
      });
      const data = await res.json();
      if (data.success) setStep("OTP");
      else setError(data.error);
    } catch (err) {
      setError("Network connectivity issue. Please retry.");
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
      setError("Authentication failed.");
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
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/partner/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Verification phase failed.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-brand-green/20">
      
      {/* Premium Light Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-green/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-100 blur-[120px] rounded-full" />

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[3rem] bg-slate-50 shadow-2xl shadow-slate-100 border border-slate-100 group"
          >
            <Store size={40} className="text-slate-900 group-hover:text-brand-green transition-colors duration-500" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
                PassFit <span className="text-brand-green">Hub</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] pl-1">Professional Partner Portal</p>
          </div>
        </div>

        <div className="bg-slate-50/50 backdrop-blur-3xl border border-slate-100 rounded-[4rem] p-10 md:p-14 shadow-3xl shadow-slate-200/20 space-y-12 outline outline-8 outline-slate-50/20">
          
          <AnimatePresence mode="wait">
            {step === "IDENTIFY" ? (
              <motion.div 
                key="identify"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                {/* Auth Mode Toggle */}
                <div className="flex p-2 bg-white border border-slate-100 rounded-3xl shadow-sm">
                  {["OTP", "PASSWORD"].map((mode) => (
                    <button 
                      key={mode}
                      onClick={() => { setAuthMode(mode as any); setError(null); }}
                      className={cn(
                        "flex-1 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300",
                        authMode === mode ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {authMode === "OTP" ? (
                  <form onSubmit={handleSendEmailOtp} className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Registered Email</label>
                      <div className="flex items-center space-x-5 bg-white border border-slate-100 p-7 rounded-[2rem] focus-within:border-brand-green focus-within:shadow-xl focus-within:shadow-brand-green/5 transition-all group shadow-sm">
                        <Mail size={22} className="text-slate-300 group-focus-within:text-brand-green transition-colors" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value.toLowerCase())}
                          placeholder="your@gym.com" 
                          className="bg-transparent border-none outline-none text-base font-extrabold text-slate-900 w-full placeholder:text-slate-200 uppercase tracking-widest"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest italic animate-pulse">{error}</p>
                    )}

                    <button 
                       type="submit"
                       disabled={isPending || !email.includes("@")}
                       className="w-full bg-slate-900 text-white font-black py-8 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-[0.4em] disabled:opacity-30 group"
                    >
                      {isPending ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                          <span>Request Access</span>
                          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordLogin} className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Hub Email</label>
                      <div className="flex items-center space-x-5 bg-white border border-slate-100 p-7 rounded-[2rem] focus-within:border-brand-green transition-all shadow-sm">
                        <Mail size={22} className="text-slate-300" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value.toLowerCase())}
                          placeholder="HUB@GYM.COM" 
                          className="bg-transparent border-none outline-none text-base font-extrabold text-slate-900 w-full placeholder:text-slate-200 uppercase tracking-widest"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Security Key</label>
                      <div className="flex items-center space-x-5 bg-white border border-slate-100 p-7 rounded-[2rem] focus-within:border-brand-green transition-all shadow-sm">
                        <Lock size={22} className="text-slate-300" />
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="bg-transparent border-none outline-none text-base font-extrabold text-slate-900 w-full placeholder:text-slate-200"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                       <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest italic">{error}</p>
                    )}

                    <button 
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-slate-900 text-white font-black py-8 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-[0.4em]"
                    >
                      {isPending ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                          <span>Enter Dashboard</span>
                          <Zap size={20} className="text-brand-green fill-brand-green" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                 <div className="flex justify-between items-center px-2">
                    <div className="space-y-1">
                      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Verify Access</h2>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Code sent to your email</p>
                    </div>
                    <button type="button" onClick={() => setStep("IDENTIFY")} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                      <ArrowLeft size={18} />
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
                        className="w-full bg-white border-2 border-dashed border-slate-100 p-10 rounded-[2.5rem] text-6xl text-center font-black text-slate-900 tracking-[0.5em] outline-none placeholder:text-slate-100 focus:border-brand-green focus:border-solid focus:shadow-2xl focus:shadow-brand-green/5 transition-all" 
                     />
                     <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
                         Secure Sync
                     </div>
                 </div>

                 {error && (
                    <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest italic animate-pulse">{error}</p>
                 )}

                 <button 
                    type="submit"
                    disabled={isPending || otp.length !== 4}
                    onClick={handleVerifyOtp}
                    className="w-full bg-slate-900 text-white font-black py-8 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-[0.5em]"
                 >
                    {isPending ? <Loader2 className="animate-spin" size={24} /> : (
                      <>
                        <span>Activate Session</span>
                        <ShieldCheck size={20} className="text-brand-green" />
                      </>
                    )}
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center space-y-6">
             <div className="flex items-center justify-center space-x-8">
                 <div className="h-[1px] w-12 bg-slate-100" />
                 <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.5em]">Enterprise Port v4.0</p>
                 <div className="h-[1px] w-12 bg-slate-100" />
             </div>
             
             <div className="flex items-center justify-center space-x-3 text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-40">
                 <Check size={12} className="text-brand-green" />
                 <span>Verified Secure Endpoint</span>
             </div>
        </div>
      </div>
    </div>
  );
}
