"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldAlert, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GodEyePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Access Denied");
      }
    } catch (err) {
      setError("System failure. Try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Visual background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-brand-blue to-brand-green shadow-2xl shadow-brand-blue/20 mb-4 animate-pulse">
            <ShieldAlert size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            God<span className="text-brand-green italic">Eye</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em]">Command Hub Access</p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Admin ID</label>
              <div className="flex items-center space-x-4 bg-white/5 border border-white/5 p-5 rounded-2xl focus-within:border-brand-blue/30 transition-all">
                <Mail size={18} className="text-zinc-700" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@aiclex.in" 
                  className="bg-transparent border-none outline-none text-sm font-bold text-white w-full placeholder:text-zinc-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Pass-Key</label>
              <div className="flex items-center space-x-4 bg-white/5 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all relative">
                <Lock size={18} className="text-zinc-700" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="bg-transparent border-none outline-none text-sm font-bold text-white w-full placeholder:text-zinc-800"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-zinc-950 font-black py-6 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-[0.2em] group"
            >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>Initiate Access</span>
                  <Zap size={18} className="fill-zinc-950 group-hover:scale-125 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center space-x-2 text-zinc-800 py-4">
           <div className="h-px w-8 bg-zinc-900" />
           <span className="text-[8px] font-black uppercase tracking-widest italic text-zinc-700">Aiclex Private Network</span>
           <div className="h-px w-8 bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
