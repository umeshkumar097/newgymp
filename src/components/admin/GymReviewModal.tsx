"use client";

import React, { useState } from "react";
import { 
  FileText, ShieldCheck, X, CreditCard, Building, 
  ChevronLeft, ChevronRight, DollarSign, AlertCircle, Loader2,
  Clock, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { approveGym, rejectGym } from "@/app/actions/admin";

interface GymReviewModalProps {
  gym: any;
  isOpen: boolean;
  onClose: () => void;
}

export function GymReviewModal({ gym, isOpen, onClose }: GymReviewModalProps) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [setupFee, setSetupFee] = useState(gym.onboardingFeeAmount?.toString() || "4999");
  const [isPending, setIsPending] = useState(false);

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
    if (!confirm("Reject this application?")) return;
    setIsPending(true);
    const res = await rejectGym(gym.id);
    if (res.success) onClose();
    setIsPending(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/60 transition-all animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/5 rounded-[3rem] w-full max-w-6xl max-h-[92vh] shadow-3xl flex flex-col animate-in zoom-in duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 px-10 py-8 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold font-heading uppercase tracking-tighter text-white">Application Review</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Partner ID: {gym.id.substring(0, 12)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Photos & Details */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Gym Identity & Media</h4>
                <div className="aspect-[16/10] bg-black rounded-[2rem] border border-white/5 overflow-hidden relative group shadow-2xl">
                  {gym.imageUrls && gym.imageUrls.length > 0 ? (
                    <>
                      <img src={gym.imageUrls[activePhoto]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="gym" />
                      {gym.imageUrls.length > 1 && (
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setActivePhoto(prev => (prev > 0 ? prev - 1 : gym.imageUrls.length - 1))}
                            className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md flex items-center justify-center text-white"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button 
                            onClick={() => setActivePhoto(prev => (prev < gym.imageUrls.length - 1 ? prev + 1 : 0))}
                            className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md flex items-center justify-center text-white"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      )}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                         {gym.imageUrls.map((_: any, i: number) => (
                           <div key={i} className={cn("h-1 rounded-full transition-all", i === activePhoto ? "w-8 bg-brand-green" : "w-2 bg-white/20")} />
                         ))}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-bold uppercase tracking-widest text-xs">No Photos Uploaded</div>
                  )}
                </div>
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                   <h5 className="text-xl font-extrabold text-white mb-1 uppercase tracking-tight">{gym.name}</h5>
                   <p className="text-sm font-medium text-slate-400">{gym.location}</p>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Ownership</h4>
                <div className="p-6 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Owner Name</p>
                      <p className="text-lg font-bold text-white uppercase">{gym.owner?.name || "Unnamed"}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">WhatsApp</p>
                      <p className="text-lg font-bold text-brand-green">{gym.owner?.phone || "N/A"}</p>
                   </div>
                </div>
              </section>
            </div>

            {/* Right Column: KYC & Approval */}
            <div className="space-y-8">
              <section className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Legal Compliance (KYC)</h4>
                
                {/* Documents Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "PAN Card", value: gym.panNumber, icon: CreditCard, color: "text-brand-green" },
                    { label: "GST/Reg", value: gym.registrationDocUrl ? "Attached" : "Missing", icon: Building, color: "text-brand-blue" },
                  ].map((doc) => (
                    <div key={doc.label} className="p-6 bg-slate-950 rounded-[1.5rem] border border-white/5 space-y-2">
                       <doc.icon size={18} className={doc.color} />
                       <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{doc.label}</p>
                       <p className="text-sm font-bold text-white truncate uppercase">{doc.value || "N/A"}</p>
                    </div>
                  ))}
                </div>

                {/* Operational Hours */}
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Operational Protocol</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-950 rounded-[1.5rem] border border-white/5 space-y-2">
                         <div className="flex items-center space-x-3 text-slate-600">
                            <Clock size={16} />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Operating Hours</p>
                         </div>
                         <p className="text-sm font-bold text-white uppercase">{gym.openingTime || "06:00 AM"} - {gym.closingTime || "10:00 PM"}</p>
                      </div>
                      <div className="p-6 bg-slate-950 rounded-[1.5rem] border border-white/5 space-y-2">
                         <div className="flex items-center space-x-3 text-slate-600">
                            <AlertCircle size={16} />
                            <p className="text-[9px] font-bold uppercase tracking-widest">Weekly Off</p>
                         </div>
                         <p className="text-sm font-bold text-white uppercase">{gym.weeklyOffDay || "None"}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <FileText size={18} className="text-slate-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">MoU / Agreement Draft</span>
                    <div className="flex-1 h-[1px] bg-white/5" />
                    <button className="text-[10px] font-black text-brand-blue uppercase hover:underline">Download Template</button>
                  </div>
                  <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center space-y-4">
                     <AlertCircle size={24} className="text-slate-700" />
                     <p className="text-[10px] font-bold text-slate-500 uppercase text-center tracking-tight">Verified digital signature pending activation</p>
                  </div>
                </div>
              </section>

              <section className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 space-y-8 shadow-inner">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Action Center</h4>
                    <span className="text-[9px] font-bold text-slate-700 uppercase">Step 1: Set Activation Fee</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 bg-slate-900 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all shadow-xl">
                       <DollarSign size={24} className="text-slate-700" />
                       <input 
                         type="number" 
                         value={setupFee}
                         onChange={(e) => setSetupFee(e.target.value)}
                         className="bg-transparent border-none outline-none text-2xl font-black text-white w-full placeholder:text-slate-800 tracking-tighter" 
                       />
                       <span className="text-xs font-black text-slate-600 uppercase pr-2">INR</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     disabled={isPending}
                     onClick={handleReject}
                     className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                   >
                     Reject Application
                   </button>
                   <button 
                     disabled={isPending}
                     onClick={handleApprove}
                     className="flex-[2] bg-brand-green text-[#0F172A] font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-2xl shadow-brand-green/20 flex items-center justify-center space-x-3"
                   >
                     {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                       <>
                         <span>Approve & Request Fee</span>
                         <ChevronRight size={18} />
                       </>
                     )}
                   </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
