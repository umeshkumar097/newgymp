"use client";

import React, { useState, useTransition } from "react";
import { Check, X, Eye, DollarSign, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { approveGym, rejectGym } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export function ModerationButtons({ gymId }: { gymId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setupFee, setSetupFee] = useState("4999"); // Default setup fee

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveGym(gymId, parseFloat(setupFee));
      if (res.success) {
        setIsModalOpen(false);
      } else {
        alert(res.error);
      }
    });
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;
    startTransition(async () => {
      const res = await rejectGym(gymId, reason);
      if (!res.success) alert(res.error);
    });
  };

  return (
    <div className="flex justify-end space-x-2 relative">
      <button className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all border border-zinc-700/50 active:scale-95">
        <Eye size={18} />
      </button>

      {/* Approve Trigger */}
      <button 
        disabled={isPending}
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-brand-green/20 active:scale-95",
          isPending ? "bg-zinc-800 text-zinc-500" : "bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white"
        )}
      >
        <Check size={18} />
      </button>

      <button 
        disabled={isPending}
        onClick={handleReject}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-red-500/20 active:scale-95",
          isPending ? "bg-zinc-800 text-zinc-500" : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
        )}
      >
        <X size={18} />
      </button>

      {/* Approval Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-zinc-950/60 transition-all duration-500">
          <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-md p-10 shadow-3xl animate-in zoom-in duration-300">
            <div className="space-y-8">
               <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mx-auto mb-4 border border-brand-green/20">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">Approve Application</h3>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Set custom onboarding fee for this partner</p>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Onboarding Fee (₹)</label>
                    <div className="flex items-center space-x-4 bg-zinc-950 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
                       <DollarSign size={20} className="text-zinc-700" />
                       <input 
                         type="number" 
                         value={setupFee}
                         onChange={(e) => setSetupFee(e.target.value)}
                         placeholder="0" 
                         className="bg-transparent border-none outline-none text-xl font-black text-white w-full placeholder:text-zinc-900" 
                       />
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-start space-x-4">
                     <AlertCircle size={16} className="text-brand-blue mt-0.5" />
                     <p className="text-[10px] font-bold text-zinc-400 leading-relaxed uppercase tracking-tight">
                        Approval will notify the partner via WhatsApp and activate their checkout screen for setup payment.
                     </p>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-zinc-950 border border-white/5 text-zinc-500 font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApprove}
                    disabled={isPending}
                    className="flex-[2] bg-brand-green text-zinc-950 font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-brand-green/10 flex items-center justify-center"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : <span>Confirm Approval</span>}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
