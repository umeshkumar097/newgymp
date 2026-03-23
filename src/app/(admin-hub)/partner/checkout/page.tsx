"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, ShieldCheck, Zap, ArrowRight, Loader2, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PartnerCheckoutPage() {
  const [isPending, setIsPending] = useState(false);
  const [gymData, setGymData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch gym data to show the fee
    fetch("/api/partner/current-gym")
      .then(res => res.json())
      .then(data => setGymData(data.gym));
  }, []);

  const handlePayment = async () => {
    setIsPending(true);
    // Simulate Payment Gateway (Razorpay)
    setTimeout(async () => {
      try {
        const res = await fetch("/api/partner/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gymId: gymData.id }),
        });
        if (res.ok) {
          router.push("/partner/dashboard?success=true");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsPending(false);
      }
    }, 2000);
  };

  if (!gymData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-green" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-outfit flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-green/10 blur-[180px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-blue/5 blur-[180px] rounded-full" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
           <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center mx-auto shadow-2xl shadow-brand-green/20">
              <Zap size={40} className="text-white fill-white" />
           </div>
           <div className="space-y-1">
              <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white line-clamp-1">
                Activate {gymData.name}
              </h1>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center">
                <Lock className="mr-2" size={12} />
                Secure Partner Activation
              </p>
           </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl rounded-[3rem] p-12 shadow-2xl space-y-12">
           
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="space-y-4 text-center md:text-left">
                 <h2 className="text-sm font-black uppercase tracking-widest text-brand-green">Early Partner Benefit</h2>
                 <div className="space-y-2">
                    <p className="text-4xl font-black text-white">90 Days</p>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Zero Commission Applied</p>
                 </div>
                 <div className="flex items-center space-x-2 text-zinc-400">
                    <Sparkles size={16} className="text-brand-green" />
                    <span className="text-xs font-medium">Keep 100% of your earnings for 3 months</span>
                 </div>
              </div>

              <div className="h-[1px] md:h-24 w-full md:w-[1px] bg-zinc-800" />

              <div className="text-center md:text-right space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">One-time Setup Fee</p>
                 <div className="flex items-center justify-center md:justify-end space-x-2">
                    <span className="text-4xl font-black text-white">₹{gymData.onboardingFeeAmount || "4,999"}</span>
                    <span className="text-zinc-600 text-sm font-bold line-through">₹9,999</span>
                 </div>
                 <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">+ GST (18%) where applicable</p>
              </div>
           </div>

           {/* Features Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Smart Dashboard Access", desc: "Real-time OTP verification hub" },
                { title: "Priority Search Ranking", desc: "Get featured in top explorer results" },
                { title: "24/7 Partner Support", desc: "Dedicated account manager" },
                { title: "WhatsApp Automated Billing", desc: "Instant receipts for your customers" }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-zinc-950 border border-white/5 flex items-start space-x-4">
                   <div className="mt-1">
                      <CheckCircle2 size={16} className="text-brand-green" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">{item.title}</p>
                      <p className="text-[10px] text-zinc-600 font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* Checkout Button */}
           <button 
              onClick={handlePayment}
              disabled={isPending}
              className="w-full bg-gradient-to-r from-brand-blue to-brand-green text-zinc-950 font-black py-6 rounded-[2rem] shadow-3xl shadow-brand-green/20 flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-[0.2em]"
           >
              {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>Initialize Secure Checkout</span>
                  <ArrowRight size={20} strokeWidth={3} />
                </>
              )}
           </button>

           <div className="text-center">
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest flex items-center justify-center">
                <ShieldCheck size={12} className="mr-2" />
                PCI-DSS Compliant Encryption Layer Active
              </p>
           </div>
        </div>

        {/* Footer Contact */}
        <p className="mt-8 text-center text-[10px] text-zinc-700 font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-500 transition-colors">
          Need help? Contact support@passfit.in
        </p>
      </div>
    </div>
  );
}
