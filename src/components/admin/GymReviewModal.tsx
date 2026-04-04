"use client";

import React, { useState } from "react";
import { 
  FileText, ShieldCheck, X, CreditCard, Building, 
  ChevronLeft, ChevronRight, AlertCircle, Loader2,
  Clock, MapPin, User, Mail, Phone, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { approveGym, rejectGym } from "@/app/actions/admin";

interface GymReviewModalProps {
  gym: any;
  isOpen: boolean;
  onClose: () => void;
  defaultOnboardingFee?: number;
}

export function GymReviewModal({ gym, isOpen, onClose, defaultOnboardingFee = 4999 }: GymReviewModalProps) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [setupFee, setSetupFee] = useState(gym.onboardingFeeAmount?.toString() || defaultOnboardingFee.toString());
  const [discount, setDiscount] = useState("0");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isPending, setIsPending] = useState(false);

  React.useEffect(() => {
    if (discount && !isNaN(parseFloat(discount))) {
      const discountedFee = defaultOnboardingFee * (1 - parseFloat(discount) / 100);
      setSetupFee(Math.round(discountedFee).toString());
    }
  }, [discount, defaultOnboardingFee]);

  if (!isOpen) return null;

  const handleApprove = async () => {
    setIsPending(true);
    const res = await approveGym(gym.id, parseFloat(setupFee));
    if (res.success) {
      onClose();
    } else {
      alert(res.error);
    }
    setIsPending(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    if (!confirm("Reject this application?")) return;
    setIsPending(true);
    const res = await rejectGym(gym.id, rejectionReason);
    if (res.success) onClose();
    else alert(res.error);
    setIsPending(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-slate-100/40 transition-all animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200/60 rounded-[3rem] w-full max-w-6xl max-h-[92vh] shadow-3xl flex flex-col animate-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden ring-1 ring-slate-100/50">
        
        {/* Refined Header */}
        <div className="bg-white px-10 py-8 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <ShieldCheck size={24} className="text-brand-green" />
            </div>
            <div className="space-y-0.5">
               <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.4em]">Governance Protocol</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0 animate-pulse" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 italic">Hub Verification <span className="text-slate-300 font-medium">/ {gym.name}</span></h3>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:shadow-sm transition-all active:scale-95">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-10 space-y-12 bg-slate-50/30">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: Visuals & Identity */}
            <div className="space-y-10">
              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Facility Documentation</h4>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{gym.imageUrls?.length || 0} Assets Loaded</span>
                </div>
                <div className="aspect-[16/10] bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden relative group shadow-sm ring-1 ring-slate-100">
                  {gym.imageUrls && gym.imageUrls.length > 0 ? (
                    <>
                      <img src={gym.imageUrls[activePhoto]} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" alt="gym" />
                      {gym.imageUrls.length > 1 && (
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button 
                            onClick={() => setActivePhoto(prev => (prev > 0 ? prev - 1 : gym.imageUrls.length - 1))}
                            className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-xl border border-white/50 hover:bg-white"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={() => setActivePhoto(prev => (prev < gym.imageUrls.length - 1 ? prev + 1 : 0))}
                            className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-xl border border-white/50 hover:bg-white"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      )}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40">
                         {gym.imageUrls.map((_: any, i: number) => (
                           <button 
                             key={i} 
                             onClick={() => setActivePhoto(i)}
                             className={cn("h-1 rounded-full transition-all duration-500", i === activePhoto ? "w-6 bg-slate-900" : "w-1.5 bg-slate-900/10")} 
                           />
                         ))}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 opacity-30">
                       <Zap size={32} className="text-slate-200" />
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">No Visual Assets</span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-3">
                   <h5 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{gym.name}</h5>
                   <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] italic">
                      <MapPin size={14} className="mr-2 text-brand-green/50" />
                      {gym.location}
                   </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic px-2">Master Ownership</h4>
                <div className="p-8 bg-white border border-slate-200/60 rounded-[2rem] grid grid-cols-2 gap-8 shadow-sm">
                   <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-slate-300">
                         <User size={12} />
                         <p className="text-[9px] font-black uppercase tracking-widest">Name</p>
                      </div>
                      <p className="text-base font-black text-slate-900 uppercase italic">{gym.owner?.name || "N/A"}</p>
                   </div>
                   <div className="space-y-1.5 text-right">
                      <div className="flex items-center justify-end space-x-2 text-slate-300">
                         <Mail size={12} />
                         <p className="text-[9px] font-black uppercase tracking-widest">Identity</p>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 truncate italic">{gym.owner?.email || "N/A"}</p>
                   </div>
                   <div className="col-span-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <Phone size={12} className="text-brand-green/60" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Contact</span>
                         </div>
                         <p className="text-base font-black text-brand-green tracking-[0.1em] tabular-nums italic">{gym.owner?.phone || "PENDING"}</p>
                      </div>
                   </div>
                </div>
              </section>
            </div>

            {/* Right Column: Compliance & Pricing */}
            <div className="space-y-10">
              <section className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic px-2">Compliance Vault (KYC)</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "PAN ID", value: gym.panNumber, icon: CreditCard, color: "text-brand-green", bg: "bg-slate-50" },
                    { label: "REGISTRY", value: gym.registrationDocUrl ? "ACTIVE" : "MISSING", icon: Building, color: "text-blue-500", bg: "bg-slate-50" },
                  ].map((doc) => (
                    <div key={doc.label} className={cn("p-6 rounded-[1.5rem] border border-slate-100 space-y-2 transition-all hover:border-slate-200", doc.bg)}>
                       <doc.icon size={16} className={doc.color} />
                       <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{doc.label}</p>
                          <p className="text-xs font-black text-slate-900 truncate uppercase italic">{doc.value || "VOID"}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-2">
                      <div className="flex items-center space-x-2 text-slate-300">
                         <Clock size={14} />
                         <p className="text-[8px] font-black uppercase tracking-widest">Timeline</p>
                      </div>
                      <p className="text-xs font-black text-slate-900 uppercase italic">{gym.openingTime || "06 AM"} - {gym.closingTime || "10 PM"}</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-2">
                      <div className="flex items-center space-x-2 text-slate-300">
                         <AlertCircle size={14} />
                         <p className="text-[8px] font-black uppercase tracking-widest">Protocol</p>
                      </div>
                      <p className="text-xs font-black text-slate-900 uppercase italic">{gym.weeklyOffDay || "NO OFF"}</p>
                   </div>
                </div>

                {/* Refined Pricing Engine (Less Massive) */}
                <div className="p-8 bg-slate-900 rounded-[2.5rem] space-y-6 relative overflow-hidden shadow-xl ring-1 ring-white/5">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/10 blur-[60px] -mr-12 -mt-12" />
                  
                  <div className="relative space-y-6">
                     <div className="flex justify-between items-center">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green italic leading-none">Decision Engine</h4>
                       <span className="text-[8px] font-black text-slate-500 uppercase italic">Base: ₹{defaultOnboardingFee}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Discount %</p>
                          <div className="bg-slate-950 border border-white/5 p-4 rounded-xl focus-within:border-brand-green/40 transition-all shadow-inner">
                             <input 
                               type="number" 
                               placeholder="0"
                               value={discount}
                               onChange={(e) => setDiscount(e.target.value)}
                               className="bg-transparent border-none outline-none text-xl font-black text-brand-green w-full placeholder:text-slate-800 tracking-tighter italic" 
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Active Fee</p>
                          <div className="bg-slate-950 border border-white/5 p-4 rounded-xl focus-within:border-brand-green/40 transition-all shadow-inner">
                             <input 
                               type="number" 
                               value={setupFee}
                               onChange={(e) => setSetupFee(e.target.value)}
                               className="bg-transparent border-none outline-none text-xl font-black text-white w-full placeholder:text-slate-800 tracking-tighter italic" 
                             />
                          </div>
                       </div>
                     </div>

                     <div className="space-y-3">
                        <textarea 
                          placeholder="Internal decision notes..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl focus:border-brand-green/40 transition-all shadow-inner text-[11px] font-bold text-slate-400 placeholder:text-slate-800 min-h-[80px] outline-none italic"
                        />
                     </div>

                     <div className="flex gap-3 pt-2">
                       <button 
                         disabled={isPending}
                         onClick={handleReject}
                         className="flex-1 bg-white/5 border border-white/5 text-slate-500 font-black py-4.5 rounded-[1.2rem] text-[9px] uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 transition-all italic"
                       >
                         {isPending ? "..." : "Reject"}
                       </button>
                       <button 
                         disabled={isPending}
                         onClick={handleApprove}
                         className="flex-[2] bg-brand-green text-slate-950 font-black py-4.5 rounded-[1.2rem] text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2 italic"
                       >
                         {isPending ? <Loader2 className="animate-spin" size={16} /> : (
                           <>
                             <span>Activate Hub</span>
                             <ChevronRight size={14} />
                           </>
                         )}
                       </button>
                     </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        
        <div className="bg-white px-10 py-5 border-t border-slate-100 flex items-center justify-between">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Enterprise Vault Access • Secured Node</p>
           <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stable Encryption</span>
           </div>
        </div>
      </div>
    </div>
  );
}
