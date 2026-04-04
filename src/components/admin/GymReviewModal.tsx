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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-100/40 transition-all animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200/60 rounded-[4rem] w-full max-w-6xl max-h-[94vh] shadow-3xl flex flex-col animate-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden ring-1 ring-slate-100">
        
        {/* Premium Header */}
        <div className="bg-slate-50/80 px-12 py-10 flex justify-between items-center border-b border-slate-100 backdrop-blur-xl">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <ShieldCheck size={32} className="text-brand-green" />
            </div>
            <div>
               <div className="flex items-center space-x-3 mb-1">
                  <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">Review Protocol</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 italic">Elite Hub <span className="text-brand-green underline decoration-slate-200 underline-offset-8">Verification</span></h3>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:shadow-lg transition-all active:scale-95">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-12 py-12 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Column: Visuals & Identity */}
            <div className="space-y-12">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Hub Visuals & Media</h4>
                   <span className="text-[9px] font-black text-brand-green uppercase tracking-widest">{gym.imageUrls?.length || 0} Assets</span>
                </div>
                <div className="aspect-[16/10] bg-slate-50 rounded-[3.5rem] border border-slate-100 overflow-hidden relative group shadow-sm ring-1 ring-slate-50">
                  {gym.imageUrls && gym.imageUrls.length > 0 ? (
                    <>
                      <img src={gym.imageUrls[activePhoto]} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="gym" />
                      {gym.imageUrls.length > 1 && (
                        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <button 
                            onClick={() => setActivePhoto(prev => (prev > 0 ? prev - 1 : gym.imageUrls.length - 1))}
                            className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center text-slate-900 shadow-xl border border-white/50 hover:bg-white"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button 
                            onClick={() => setActivePhoto(prev => (prev < gym.imageUrls.length - 1 ? prev + 1 : 0))}
                            className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl flex items-center justify-center text-slate-900 shadow-xl border border-white/50 hover:bg-white"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </div>
                      )}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                         {gym.imageUrls.map((_: any, i: number) => (
                           <button 
                             key={i} 
                             onClick={() => setActivePhoto(i)}
                             className={cn("h-1.5 rounded-full transition-all duration-500", i === activePhoto ? "w-8 bg-brand-green" : "w-2 bg-slate-900/20")} 
                           />
                         ))}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                       <Zap size={48} className="text-slate-100" />
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No Media Assets</span>
                    </div>
                  )}
                </div>
                
                <div className="p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 space-y-4">
                   <h5 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{gym.name}</h5>
                   <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">
                      <MapPin size={16} className="mr-3 text-brand-green" />
                      {gym.location}
                   </div>
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Ownership Protocol</h4>
                <div className="p-10 bg-white border border-slate-100 rounded-[3rem] grid grid-cols-2 gap-10 shadow-sm">
                   <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-slate-300 mb-1">
                         <User size={14} />
                         <p className="text-[9px] font-black uppercase tracking-widest">Master Partner</p>
                      </div>
                      <p className="text-xl font-black text-slate-900 uppercase italic leading-none">{gym.owner?.name || "Unnamed"}</p>
                   </div>
                   <div className="space-y-2 text-right">
                      <div className="flex items-center justify-end space-x-3 text-slate-300 mb-1">
                         <Mail size={14} />
                         <p className="text-[9px] font-black uppercase tracking-widest">Email Identity</p>
                      </div>
                      <p className="text-xs font-bold text-slate-500 truncate italic">{gym.owner?.email || "N/A"}</p>
                   </div>
                   <div className="col-span-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <Phone size={14} className="text-brand-green" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Access</span>
                         </div>
                         <p className="text-lg font-black text-brand-green tracking-widest tabular-nums italic">{gym.owner?.phone || "NOT PROVIDED"}</p>
                      </div>
                   </div>
                </div>
              </section>
            </div>

            {/* Right Column: Compliance & Activation */}
            <div className="space-y-12">
              <section className="space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Compliance Check (KYC)</h4>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "PAN CARD ID", value: gym.panNumber, icon: CreditCard, color: "text-brand-green", bg: "bg-brand-green/5" },
                    { label: "REGISTRATION", value: gym.registrationDocUrl ? "VERIFIED" : "PENDING", icon: Building, color: "text-blue-500", bg: "bg-blue-500/5" },
                  ].map((doc) => (
                    <div key={doc.label} className={cn("p-8 rounded-[2.5rem] border border-slate-100 space-y-3 transition-all hover:shadow-lg", doc.bg)}>
                       <doc.icon size={20} className={doc.color} />
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{doc.label}</p>
                          <p className="text-sm font-black text-slate-900 truncate uppercase italic">{doc.value || "MISSING"}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Operations Flow</h4>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-3">
                         <div className="flex items-center space-x-3 text-slate-300">
                            <Clock size={16} />
                            <p className="text-[9px] font-black uppercase tracking-widest">Active Window</p>
                         </div>
                         <p className="text-sm font-black text-slate-900 uppercase italic leading-none">{gym.openingTime || "06:00 AM"} - {gym.closingTime || "10:00 PM"}</p>
                      </div>
                      <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-3">
                         <div className="flex items-center space-x-3 text-slate-300">
                            <AlertCircle size={16} />
                            <p className="text-[9px] font-black uppercase tracking-widest">Maintenance</p>
                         </div>
                         <p className="text-sm font-black text-slate-900 uppercase italic leading-none">{gym.weeklyOffDay || "NON-STOP"}</p>
                      </div>
                   </div>
                </div>

                <div className="p-10 bg-slate-900 rounded-[3.5rem] space-y-8 relative overflow-hidden group shadow-2xl">
                  {/* Dark Pricing Engine Card */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 blur-[80px] -mr-16 -mt-16" />
                  
                  <div className="relative space-y-8">
                     <div className="flex justify-between items-center">
                       <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-green italic">Master Pricing</h4>
                       <span className="text-[9px] font-black text-slate-500 uppercase italic">Base Rate: ₹{defaultOnboardingFee}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Discount (%)</p>
                          <div className="bg-slate-950 border border-white/5 p-6 rounded-[1.5rem] focus-within:border-brand-green/40 transition-all shadow-inner">
                             <input 
                               type="number" 
                               placeholder="0"
                               value={discount}
                               onChange={(e) => setDiscount(e.target.value)}
                               className="bg-transparent border-none outline-none text-2xl font-black text-brand-green w-full placeholder:text-slate-800 tracking-tighter italic" 
                             />
                          </div>
                       </div>

                       <div className="space-y-3">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Final Activation Fee</p>
                          <div className="bg-slate-950 border border-white/5 p-6 rounded-[1.5rem] focus-within:border-brand-green/40 transition-all shadow-inner">
                             <input 
                               type="number" 
                               value={setupFee}
                               onChange={(e) => setSetupFee(e.target.value)}
                               className="bg-transparent border-none outline-none text-2xl font-black text-white w-full placeholder:text-slate-800 tracking-tighter italic" 
                             />
                          </div>
                       </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Reason for Decision (Internal Log)</p>
                        <textarea 
                          placeholder="e.g. Documentation verified, gym standards match elite criteria..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full bg-slate-950 border border-white/5 p-6 rounded-[1.5rem] focus:border-brand-green/40 transition-all shadow-inner text-xs font-bold text-slate-300 placeholder:text-slate-800 min-h-[100px] outline-none italic"
                        />
                     </div>

                     <div className="flex gap-4 pt-4">
                       <button 
                         disabled={isPending}
                         onClick={handleReject}
                         className="flex-1 bg-white/5 border border-white/5 text-slate-500 font-black py-6 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 italic"
                       >
                         {isPending ? "..." : "Reject"}
                       </button>
                       <button 
                         disabled={isPending}
                         onClick={handleApprove}
                         className="flex-[2.5] bg-brand-green text-slate-950 font-black py-6 rounded-[2rem] text-[11px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-brand-green/20 flex items-center justify-center space-x-3 italic"
                       >
                         {isPending ? <Loader2 className="animate-spin text-slate-950" size={20} /> : (
                           <>
                             <span>Approve Hub</span>
                             <ChevronRight size={18} />
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
        
        <div className="bg-slate-50 px-12 py-6 border-t border-slate-100 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] italic">PassFit Governance Mode • Enterprise Secure Port</p>
        </div>
      </div>
    </div>
  );
}
