"use client";

import React, { useState, useTransition } from "react";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { verifyBooking } from "@/app/actions/partner";
import { cn } from "@/lib/utils";

export function OtpVerification({ gymId }: { gymId: string }) {
  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleVerify = () => {
    if (otp.length !== 4) return;
    setMessage(null);
    
    startTransition(async () => {
      try {
        const res = await verifyBooking(otp, gymId);
        if (res.success) {
          setMessage({ text: "Access Granted! Welcome member.", type: "success" });
          setOtp("");
        } else {
          setMessage({ text: res.error || "Invalid Access Code", type: "error" });
        }
      } catch (err) {
        setMessage({ text: "Network error. Try again.", type: "error" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 relative group">
        <div className={cn(
          "flex-1 bg-slate-50 border-2 border-dashed rounded-[2rem] px-8 py-6 transition-all duration-500 flex items-center shadow-sm",
          isPending ? "opacity-50 grayscale" : "border-slate-100 group-focus-within:border-brand-green group-focus-within:bg-white group-focus-within:shadow-2xl group-focus-within:shadow-brand-green/5 group-focus-within:border-solid"
        )}>
          <input 
            type="text" 
            value={otp}
            disabled={isPending}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="0000" 
            className="bg-transparent border-none outline-none text-slate-900 font-black text-5xl w-full placeholder:text-slate-200 tracking-[0.5em] text-center"
            maxLength={4}
          />
        </div>
        <button 
          disabled={isPending || otp.length !== 4}
          onClick={handleVerify}
          className={cn(
            "w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl active:scale-90 transition-all duration-500 disabled:opacity-30 disabled:grayscale",
            message?.type === "success" ? "bg-brand-green text-white shadow-brand-green/20" : "bg-slate-900 text-white shadow-slate-200/50"
          )}
        >
          {isPending ? <Loader2 className="animate-spin" size={32} /> : <ArrowRight size={32} strokeWidth={3} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
               "p-6 rounded-[1.8rem] flex items-center space-x-4 border animate-in slide-in-from-top-2 duration-500",
               message.type === "success" ? "bg-brand-green/5 border-brand-green/20 text-brand-green" : "bg-red-50 border-red-100 text-red-500"
            )}
          >
             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", message.type === "success" ? "bg-brand-green/10" : "bg-red-500/10")}>
                {message.type === "success" ? <ShieldCheck size={20} /> : <X size={20} />}
             </div>
             <p className="text-[11px] font-black uppercase tracking-widest leading-none">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Minimal Framer Motion Mock helpers if needed or just use standard div if not installed (but it is installed)
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
