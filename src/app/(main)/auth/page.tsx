"use client";

import React, { useState, useTransition } from "react";
import { User, Phone, ArrowRight, ShieldCheck, Mail, CheckCircle2, Loader2, ArrowLeft, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Form State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (mode === "register" && (!name || !email)) {
      setError("Please fill in your name and email to register");
      return;
    }

    setError(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, name, email, mode }),
        });
        
        const data = await res.json();
        
        if (data.success) {
          setStep("OTP");
          setSuccessMsg(data.message || "Code sent to WhatsApp & Email ✅");
        } else {
          setError(data.error || "Failed to send code. Please try again.");
        }
      } catch (err: any) {
        console.error("Auth Send Error:", err);
        setError("Network error. Please check your connection.");
      }
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, otp, name, email, mode }),
        });

        const data = await res.json();
        if (data.success) {
          router.push("/");
          router.refresh();
        } else {
          setError(data.error || "Invalid verification code.");
        }
      } catch (err: any) {
        console.error("Verification Error:", err);
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Brand Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-green/5 blur-[150px] rounded-full" />

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-20 relative z-10">
        
        {/* Left Side (Desktop) */}
        <div className="hidden md:flex flex-col space-y-8 max-w-md">
           <div className="w-16 h-16 rounded-[2rem] bg-brand-green flex items-center justify-center shadow-2xl shadow-brand-green/20">
              <Zap size={32} className="text-[#0F172A] fill-[#0F172A]" />
           </div>
           <div className="space-y-4">
              <h1 className="text-7xl font-extrabold font-heading text-white tracking-tighter leading-none uppercase">
                 Pass<span className="text-brand-green">Fit</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                 Fast, simple, and reliable access to fitness hubs near you. One code, zero hassle.
              </p>
           </div>
           <div className="flex flex-col space-y-4 pt-4 text-xs font-bold text-slate-400">
              {[ "Official WhatsApp OTP", "Instant Dashboard Access", "End-to-End Secure" ].map((t, i) => (
                <div key={i} className="flex items-center space-x-3">
                   <CheckCircle2 size={18} className="text-brand-green" />
                   <span>{t}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
           
           <div className="text-center space-y-2 mb-10">
              <h1 className="text-4xl font-extrabold font-heading text-white tracking-tighter uppercase leading-none">
                 Pass<span className="text-brand-green">Fit</span>
              </h1>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-1">
                 {step === "PHONE" ? (mode === "login" ? "Welcome Back" : "Create Account") : "Verification Code"}
              </p>
           </div>

           {step === "PHONE" ? (
             <div className="space-y-8">
               <div className="flex p-1 bg-slate-900 border border-white/5 rounded-2xl">
                  {["login", "register"].map((m) => (
                    <button key={m} onClick={() => setMode(m as any)} className={cn("flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", mode === m ? "bg-white text-slate-950" : "text-slate-500")}>
                      {m}
                    </button>
                  ))}
               </div>

               <div className="space-y-4">
                 {mode === "register" && (
                   <>
                    <div className="space-y-2">
                      <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-600 px-1 ml-1"><User size={10} className="mr-2"/> Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-brand-green/30 px-6" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-600 px-1 ml-1"><Mail size={10} className="mr-2"/> Email</label>
                       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-brand-green/30 px-6" />
                    </div>
                   </>
                 )}
                 <div className="space-y-2">
                    <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-600 px-1 ml-1"><Phone size={10} className="mr-2"/> WhatsApp Phone</label>
                    <input 
                      type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} 
                      placeholder="9999999999" 
                      className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-brand-green/30 px-6" 
                      maxLength={10} 
                    />
                 </div>
               </div>

               {error && (
                 <p className="text-red-500 text-[10px] font-bold uppercase text-center leading-relaxed bg-red-500/5 py-3 rounded-xl border border-red-500/10">
                   {error}
                 </p>
               )}

               <button 
                  onClick={handleSendOtp}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-brand-blue/90 to-brand-green/90 text-white font-bold py-5 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
               >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : <><span>Get Verification Code</span> <ArrowRight size={18}/></>}
               </button>
             </div>
           ) : (
             <div className="space-y-8 text-center">
               <div className="flex justify-between items-center px-1">
                 <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">4-Digit Verification Code</h2>
                 <button onClick={() => setStep("PHONE")} className="text-[10px] font-bold text-brand-green uppercase tracking-widest flex items-center">
                   <ArrowLeft size={10} className="mr-2" /> Change
                 </button>
               </div>
               
               <input 
                  type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="0000" 
                  maxLength={4} 
                  className="w-full bg-white/5 border border-white/10 p-8 rounded-[2rem] text-4xl text-center font-bold text-brand-green tracking-[0.4em] outline-none" 
               />

               {successMsg && <p className="text-brand-green text-[10px] font-bold uppercase">{successMsg}</p>}
               {error && <p className="text-red-500 text-[10px] font-bold uppercase leading-relaxed">{error}</p>}

               <button 
                  onClick={handleVerifyOtp}
                  disabled={isPending || otp.length < 4}
                  className="w-full bg-white text-slate-950 font-bold py-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
               >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : <><span>Enter Dashboard</span> <ShieldCheck size={18} /></>}
               </button>

               <button onClick={handleSendOtp} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-all">
                 Didn't receive code? Resend
               </button>
             </div>
           )}
        </div>
      </div>

      <div className="absolute bottom-8 text-[8px] text-slate-800 font-bold uppercase tracking-[1.5em] z-10">
         Version 4.0.0-Bypass
      </div>
    </div>
  );
}
