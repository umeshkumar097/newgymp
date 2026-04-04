"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { completeUserProfile } from "@/app/actions/auth";

export default function CompleteProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    const result = await completeUserProfile({ phone });

    if (result.success) {
      // Update the NextAuth session so the middleware recognizes the phone
      await update({ phone });
      router.push("/");
      router.refresh();
    } else {
      setError(result.error || "Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-green/10 border border-brand-green/20 mb-4 animate-bounce">
            <Phone className="text-brand-green" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold font-heading text-slate-900 tracking-tight uppercase italic decoration-brand-green decoration-8 underline-offset-4">
             Welcome to Pass<span className="text-brand-green">Fit</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">
             Thanks for joining, {session?.user?.name?.split(" ")[0]}! We just need your phone number to secure your bookings.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="99999 99999"
                    className="block w-full pl-16 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all group-hover:border-slate-300"
                  />
                </div>
                {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight ml-1 animate-shake">{error}</p>}
             </div>

             <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20 active:scale-[0.98] disabled:opacity-50"
             >
                {loading ? (
                   <Loader2 className="animate-spin" size={20} />
                ) : (
                   <>
                     <span className="uppercase tracking-widest text-xs">Complete Registration</span>
                     <ArrowRight size={18} />
                   </>
                )}
             </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200/50 flex items-center justify-center space-x-2 text-slate-400">
             <ShieldCheck size={14} />
             <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Secured by PassFit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
