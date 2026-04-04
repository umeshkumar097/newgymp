"use client";

import React, { useState, useEffect, useTransition } from "react";
import { User, Phone, ArrowRight, ShieldCheck, Mail, Lock, CheckCircle2, Loader2, ArrowLeft, Zap, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Setup Invisible ReCAPTCHA once when the component mounts
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'normal'
        });
      } catch (err) {
        console.error("ReCAPTCHA Link Fail:", err);
      }
    }
  }, []);

  const handleSendOtp = async () => {
    // Pre-parse: Remove any non-numeric things except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, "").replace(/^0+/, "");
    const fullPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;

    setError(null);
    startTransition(async () => {
      try {
        if (!window.recaptchaVerifier) throw new Error("Recaptcha not ready");
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
        setConfirmationResult(result);
        setStep("OTP");
      } catch (err: any) {
        console.error("Firebase Auth Error:", err);
        const errorCode = err.code || "unknown";
        if (errorCode === "auth/invalid-phone-number") {
          setError("Invalid phone number. Use 10 digits.");
        } else if (errorCode === "auth/too-many-requests") {
          setError("Too many attempts. Please wait 10 minutes.");
        } else if (errorCode === "auth/unauthorized-domain") {
          setError("Domain passfit.in not authorized in Firebase.");
        } else if (errorCode === "auth/billing-not-enabled") {
          setError("SMS Quota full. Try the WhatsApp button below.");
        } else {
          setError(`Error (${errorCode}): Please use WhatsApp.`);
        }
      }
    });
  };

  const handleWhatsAppFallback = async () => {
    if (!phoneNumber) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, name, email }),
        });
        const data = await res.json();
        if (data.success) {
          setStep("OTP");
          setConfirmationResult(null); // Signal it's NOT a Firebase session
          setError(null);
        } else {
          setError(data.error || "WhatsApp delivery failed.");
        }
      } catch (err) {
        setError("WhatsApp delivery failed. Try again.");
      }
    });
  };

  const handleVerifyOtp = async () => {
    // Firebase uses 6 digits, our WhatsApp fallback uses 4 digits
    const expectedLength = confirmationResult ? 6 : 4;
    if (otp.length !== expectedLength) {
      setError(`Please enter the ${expectedLength}-digit code`);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        let payload: any = { phoneNumber, name, email, mode };

        if (confirmationResult) {
          // A. Verify with Firebase
          const credential = await confirmationResult.confirm(otp);
          payload.idToken = await credential.user.getIdToken();
        } else {
          // B. Verify with our Backend (WhatsApp/Custom Fallback)
          payload.otp = otp;
        }

        // Finalize with our Backend
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          router.push("/");
          router.refresh();
        } else {
          setError(data.error || "Verification failed on server");
        }
      } catch (err: any) {
        console.error("Verification Error:", err);
        setError("Invalid code. Please check and try again.");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Brand Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-green/5 blur-[150px] rounded-full" />

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-20 relative z-10">
        
        {/* Desk Side */}
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
           <div className="flex flex-col space-y-4 pt-4 text-xs font-bold text-slate-400">
              {[ "Instant Entry via QR", "No Commitments", "Pay per Session" ].map((t, i) => (
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
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-brand-green/30" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-600 px-1 ml-1"><Mail size={10} className="mr-2"/> Email</label>
                       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-brand-green/30" />
                    </div>
                   </>
                 )}
                 <div className="space-y-2">
                    <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-600 px-1 ml-1"><Phone size={10} className="mr-2"/> WhatsApp Phone</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-brand-green/30" maxLength={10} />
                 </div>
               </div>

               {error && (
                 <div className="space-y-4 text-center">
                   <p className="text-red-500 text-[10px] font-bold uppercase leading-relaxed tracking-wider bg-red-500/5 py-3 rounded-xl border border-red-500/20">{error}</p>
                   <button 
                     onClick={handleWhatsAppFallback}
                     className="w-full py-4 bg-brand-green/10 border border-brand-green/30 rounded-2xl flex items-center justify-center space-x-3 text-brand-green text-[10px] font-bold uppercase tracking-widest hover:bg-brand-green/20 transition-all shadow-xl shadow-brand-green/5"
                   >
                     <MessageCircle size={14} className="fill-brand-green/20" />
                     <span>Get Access Code via WhatsApp instead</span>
                   </button>
                 </div>
               )}

               <div id="recaptcha-container" className="flex justify-center mb-4"></div>

               <button 
                  onClick={handleSendOtp}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-brand-blue/90 to-brand-green/90 text-white font-bold py-5 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
               >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : <><span>Get Verification Code</span> <ArrowRight size={18}/></>}
               </button>
             </div>
           ) : (
             <div className="space-y-8">
               <div className="flex justify-between items-center px-1">
                 <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{confirmationResult ? "6-Digit SMS Code" : "4-Digit WhatsApp Code"}</h2>
                 <button onClick={() => setStep("PHONE")} className="text-[10px] font-bold text-brand-green uppercase tracking-widest flex items-center">
                   <ArrowLeft size={10} className="mr-2" /> Change
                 </button>
               </div>
               
               <input 
                  type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={confirmationResult ? "000000" : "0000"} 
                  maxLength={confirmationResult ? 6 : 4} 
                  className="w-full bg-white/5 border border-white/10 p-8 rounded-[2rem] text-4xl text-center font-bold text-brand-green tracking-[0.4em] outline-none" 
               />

               {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}

               <button 
                  onClick={handleVerifyOtp}
                  disabled={isPending || otp.length < 4}
                  className="w-full bg-white text-slate-950 font-bold py-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
               >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : <><span>Enter Dashboard</span> <ShieldCheck size={18} /></>}
               </button>
             </div>
           )}
        </div>
      </div>

      <div className="absolute bottom-8 text-[8px] text-slate-800 font-bold uppercase tracking-[1.5em] z-10">
         Version 3.2.1-Failover
      </div>
    </div>
  );
}

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
