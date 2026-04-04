"use client";

import React, { useState } from "react";
import { User, ShieldCheck, Mail, CheckCircle2, Lock, Eye, EyeOff, CheckSquare, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // If already logged in, redirect to home
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Don't show the form if redirecting
  if (status === "authenticated" || status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }
    if (!email || !password || !name) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Automatically sign in after registration
        await signIn("credentials", { email, password, callbackUrl: "/" });
      } else {
        setError(data.error || "Registration failed.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-green/5 blur-[150px] rounded-full" />

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-20 relative z-10">
        
        {/* Left Side (Desktop Branding) */}
        <div className="hidden md:flex flex-col space-y-8 max-w-sm">
           <div className="space-y-4">
              <h1 className="text-7xl font-extrabold font-heading text-slate-900 tracking-tighter leading-none uppercase">
                 Pass<span className="text-brand-green">Fit</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                 Fast, simple, and reliable access to fitness hubs near you. Instant access, zero hassle.
              </p>
           </div>
           <div className="flex flex-col space-y-4 pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              {[ "One-Tap Google Access", "Verified Gym Partners", "Flexible Day Passes" ].map((t, i) => (
                <div key={i} className="flex items-center space-x-3">
                   <CheckCircle2 size={16} className="text-brand-green" />
                   <span>{t}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50">
           
           <div className="text-center space-y-4 mb-10">
              <h1 className="text-3xl font-extrabold font-heading text-slate-900 tracking-tighter uppercase leading-none md:hidden">
                 Pass<span className="text-brand-green">Fit</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] px-1">
                 {mode === "login" ? "Welcome Back" : "Experience Fitness"}
              </p>
           </div>

           {/* Google Login Button */}
           <button 
             onClick={() => signIn("google", { callbackUrl: "/" })}
             className="w-full flex items-center justify-center space-x-4 py-4 px-6 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm mb-8"
           >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
               <path fill="#EA4335" d="M24 12.27c0-.85-.07-1.66-.21-2.45h-11.79v4.63h6.61c-.28 1.54-1.15 2.85-2.46 3.73v3.1h3.98c2.33-2.14 3.67-5.3 3.67-9.01z" />
               <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.98-3.1c-1.11.75-2.53 1.19-3.95 1.19-2.73 0-5.04-1.85-5.86-4.33h-4.12v3.19c2.03 4.03 6.18 6.96 10.98 6.96z" />
               <path fill="#4285F4" d="M6.14 14.85c-.21-.63-.33-1.3-.33-2s.12-1.37.33-2v-3.19h-4.12c-.69 1.38-1.09 2.92-1.09 4.54s.4 3.16 1.09 4.54l4.12-3.19z" />
               <path fill="#FBBC05" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45c-2.1-1.96-4.85-3.1-8.05-3.1-4.8 0-8.95 2.93-10.98 6.96l4.12 3.19c.82-2.48 3.13-4.33 5.86-4.33z" />
             </svg>
             <span>Continue with Google</span>
           </button>

           <div className="relative flex items-center justify-center mb-8">
              <div className="w-full border-t border-slate-100" />
              <span className="absolute px-4 bg-white text-[10px] text-slate-300 font-bold uppercase tracking-widest">or email</span>
           </div>

           <form onSubmit={mode === "login" ? handlePasswordLogin : handleRegister} className="space-y-6">
              <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-2xl mb-2">
                 {["login", "register"].map((m) => (
                   <button 
                     key={m} type="button" onClick={() => { setMode(m as any); setError(null); }} 
                     className={cn("flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                   >
                     {m}
                   </button>
                 ))}
              </div>

              <div className="space-y-4 text-slate-900">
                {mode === "register" && (
                   <div className="space-y-1">
                      <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-400 ml-1"><User size={10} className="mr-2"/> Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold focus:bg-white focus:border-brand-green/30 outline-none transition-all" />
                   </div>
                )}
                <div className="space-y-1">
                   <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-400 ml-1"><Mail size={10} className="mr-2"/> Email Address</label>
                   <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold focus:bg-white focus:border-brand-green/30 outline-none transition-all" />
                </div>
                <div className="space-y-1 relative">
                   <label className="text-[10px] items-center flex font-bold uppercase tracking-widest text-slate-400 ml-1"><Lock size={10} className="mr-2"/> Password</label>
                   <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold focus:bg-white focus:border-brand-green/30 outline-none transition-all pr-12" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                   </div>
                </div>
              </div>

              {mode === "register" && (
                <button 
                  type="button" 
                  onClick={() => setConsent(!consent)}
                  className="flex items-start space-x-3 text-left group"
                >
                  <div className={cn("mt-0.5 transition-colors", consent ? "text-brand-green" : "text-slate-200")}>
                    {consent ? <CheckSquare size={16} fill="currentColor" className="text-white" /> : <Square size={16} />}
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 leading-normal">
                    I agree to the <span className="text-slate-900 font-bold hover:underline">Terms of Service</span> and <span className="text-slate-900 font-bold hover:underline">Privacy Policy</span>.
                  </p>
                </button>
              )}

              {error && (
                <p className="text-red-500 text-[10px] font-bold uppercase text-center bg-red-50 p-3 rounded-xl border border-red-100">
                  {error}
                </p>
              )}

              <button 
                 type="submit"
                 disabled={isLoading || (mode === "register" && !consent)}
                 className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
              >
                 {isLoading ? <span className="animate-pulse">Processing...</span> : <><span>{mode === "login" ? "Sign In" : "Create Account"}</span> <ShieldCheck size={16} /></>}
              </button>
           </form>
        </div>
      </div>

      <div className="absolute bottom-8 text-[8px] text-slate-200 font-bold uppercase tracking-[1.5em] z-10">
         Elite Version 5.0.0
      </div>
    </div>
  );
}
