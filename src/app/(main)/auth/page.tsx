"use client";

import React, { useState, useTransition } from "react";
import { User, Phone, ArrowRight, ShieldCheck, Mail, Lock, CheckCircle2, Loader2, ArrowLeft, Zap } from "lucide-react";
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

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit phone number");
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

        const data = await res.json();
        if (data.success) {
          setStep("OTP");
          setError(null);
        } else {
          setError(data.error || "Failed to send OTP");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setError("Please enter the 4-digit OTP");
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
          setError(data.error || "Invalid OTP code");
        }
      } catch (err) {
        setError("Verification failed. Please try again.");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Brand Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-green/5 blur-[150px] rounded-full" />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-20 relative z-10">
        
        {/* Brand Side (Desktop Only) */}
        <div className="hidden md:flex flex-col space-y-8 max-w-md">
           <div className="w-16 h-16 rounded-[2rem] bg-brand-green flex items-center justify-center shadow-2xl shadow-brand-green/20">
              <Zap size={32} className="text-[#0F172A] fill-[#0F172A]" />
           </div>
           <div className="space-y-4">
              <h1 className="text-7xl font-extrabold font-heading text-white tracking-tighter leading-none uppercase">
                 Pass<span className="text-brand-green">Fit</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                 Join thousands of users accessing premium fitness centers across the country. One account, infinite access.
              </p>
           </div>
           <div className="flex flex-col space-y-4 pt-4">
              {[
                { icon: CheckCircle2, text: "Instant Entry via QR Code" },
                { icon: CheckCircle2, text: "No Long-term Commitments" },
                { icon: CheckCircle2, text: "Pay per Session Model" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-400">
                   <item.icon size={18} className="text-brand-green" />
                   <span>{item.text}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
           
           {/* Header for Mobile */}
           <div className="md:hidden text-center space-y-4 mb-10">
              <h1 className="text-4xl font-extrabold font-heading text-white tracking-tighter uppercase">
                 Pass<span className="text-brand-green">Fit</span>
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                {step === "PHONE" ? "Ready to workout?" : "Verification Code"}
              </p>
           </div>

           {step === "PHONE" ? (
             <div className="space-y-8">
               {/* Mode Toggle */}
               <div className="flex p-1 bg-slate-900 border border-white/5 rounded-2xl">
                  <button 
                    onClick={() => setMode("login")}
                    className={cn(
                      "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                      mode === "login" ? "bg-white text-[#0F172A]" : "text-slate-500"
                    )}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setMode("register")}
                    className={cn(
                      "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                      mode === "register" ? "bg-white text-[#0F172A]" : "text-slate-500"
                    )}
                  >
                    Register
                  </button>
               </div>

                {/* Inputs */}
               <div className="space-y-4">
                 {mode === "register" && (
                   <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1">Full Name</label>
                      <div className="flex items-center space-x-4 bg-white/5 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
                        <User size={18} className="text-slate-700" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="bg-transparent border-none outline-none text-sm font-bold text-white w-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1">Email</label>
                      <div className="flex items-center space-x-4 bg-white/5 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
                        <Mail size={18} className="text-slate-700" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="bg-transparent border-none outline-none text-sm font-bold text-white w-full" />
                      </div>
                    </div>
                   </>
                 )}
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-1">WhatsApp Phone</label>
                    <div className="flex items-center space-x-4 bg-white/5 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
                      <Phone size={18} className="text-slate-700" />
                      <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" className="bg-transparent border-none outline-none text-sm font-bold text-white w-full" maxLength={10} />
                    </div>
                 </div>
               </div>

               {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

               <button 
                  onClick={handleSendOtp}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-brand-blue/90 to-brand-green/90 text-white font-bold py-5 rounded-[2rem] shadow-2xl shadow-brand-blue/20 flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest backdrop-blur-sm"
               >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>Get Access Code</span>
                      <ArrowRight size={18} />
                    </>
                  )}
               </button>
             </div>
           ) : (
             <div className="space-y-8">
               <div className="flex justify-between items-center">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-white">Enter OTP</h2>
                 <button onClick={() => setStep("PHONE")} className="text-[10px] font-bold text-brand-green uppercase tracking-widest flex items-center">
                   <ArrowLeft size={12} className="mr-1" />
                   Change
                 </button>
               </div>
               
               <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  placeholder="0000" 
                  maxLength={4} 
                  className="w-full bg-white/5 border border-white/10 p-8 rounded-[2rem] text-5xl text-center font-bold text-brand-green tracking-[0.4em] outline-none placeholder:text-slate-800" 
               />

               {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

               <button 
                  onClick={handleVerifyOtp}
                  disabled={isPending || otp.length !== 4}
                  className="w-full bg-white text-[#0F172A] font-bold py-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-[0.2em]"
               >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>Secure Access</span>
                      <ShieldCheck size={18} />
                    </>
                  )}
               </button>

               <div className="flex flex-col items-center space-y-4 pt-4 border-t border-white/5">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                   Didn't receive the code?
                 </p>
                 <button 
                   onClick={handleSendOtp}
                   disabled={isPending}
                   className="text-xs font-extrabold text-brand-green uppercase tracking-widest hover:underline disabled:opacity-50"
                 >
                   Resend Code via WhatsApp
                 </button>
               </div>
             </div>
           )}

           <div className="flex items-center justify-center space-x-2 text-slate-700 mt-10">
              <Lock size={12} />
              <span className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encrypted Auth</span>
           </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 text-[9px] text-slate-800 font-bold uppercase tracking-[1em] z-10">
         Version 3.1.2
      </div>
    </div>
  );
}
