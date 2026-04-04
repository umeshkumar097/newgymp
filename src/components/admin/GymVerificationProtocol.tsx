"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, CreditCard, Building, 
  ChevronLeft, ChevronRight, AlertCircle, Loader2,
  Clock, MapPin, User, Mail, Phone, Zap, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { approveGym, rejectGym } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface GymVerificationProtocolProps {
  gym: any;
  defaultOnboardingFee?: number;
}

export function GymVerificationProtocol({ gym, defaultOnboardingFee = 4999 }: GymVerificationProtocolProps) {
  const router = useRouter();
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

  const handleApprove = async () => {
    setIsPending(true);
    const res = await approveGym(gym.id, parseFloat(setupFee));
    if (res.success) {
      router.push("/admin/gyms");
      router.refresh();
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
    if (res.success) {
      router.push("/admin/gyms");
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsPending(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-in fade-in duration-700">
      
      {/* Protocol Header */}
      <header className="h-24 bg-white border-b border-slate-200/60 flex items-center justify-between px-10 sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all active:scale-95 group shadow-sm"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center space-x-5 pl-2 border-l border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <ShieldCheck size={24} className="text-brand-green" />
            </div>
            <div className="space-y-0.5">
               <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.4em]">Review Hub</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0 animate-pulse" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Partner <span className="text-slate-400 font-medium">Verification</span></h3>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</p>
              <p className="text-sm font-black text-slate-950 mt-1 uppercase leading-none">{gym.status}</p>
           </div>
           <div className="w-[1px] h-10 bg-slate-200 rounded-full mx-2" />
           <div className="flex flex-col items-center justify-center">
              <p className="text-[8px] font-black text-brand-green uppercase tracking-widest">Active</p>
              <div className="w-2 h-2 rounded-full bg-brand-green mt-1" />
           </div>
        </div>
      </header>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-16">
        
        {/* Core Verification Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Media & Identity */}
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Facility Media</h4>
                 <span className="text-[9px] font-black text-brand-green uppercase tracking-widest leading-none">{gym.imageUrls?.length || 0} Assets Uploaded</span>
              </div>
              
              <div className="aspect-[16/10] bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden relative group shadow-2xl shadow-slate-200/20 ring-1 ring-slate-100/50">
                {gym.imageUrls && gym.imageUrls.length > 0 ? (
                  <>
                    <Image src={gym.imageUrls[activePhoto]} alt="hub evidence" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" width={800} height={500} unoptimized />
                    {gym.imageUrls.length > 1 && (
                      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => setActivePhoto(prev => (prev > 0 ? prev - 1 : gym.imageUrls.length - 1))}
                          className="w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-xl border border-white/50 hover:bg-white"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={() => setActivePhoto(prev => (prev < gym.imageUrls.length - 1 ? prev + 1 : 0))}
                          className="w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-xl border border-white/50 hover:bg-white"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </div>
                    )}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                       {gym.imageUrls.map((_: any, i: number) => (
                         <button 
                           key={i} 
                           onClick={() => setActivePhoto(i)}
                           className={cn("h-1 rounded-full transition-all duration-500", i === activePhoto ? "w-8 bg-brand-green" : "w-2 bg-white/40")} 
                         />
                       ))}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20 bg-slate-50">
                     <Zap size={48} className="text-slate-400" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">No Media Found</span>
                  </div>
                )}
              </div>
              
              <div className="p-10 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 space-y-4 ring-1 ring-slate-100/50">
                 <div className="flex justify-between items-start">
                    <h5 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none">{gym.name}</h5>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-200/40 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">ID: {gym.id.substring(0, 8)}</div>
                 </div>
                 <div className="flex items-center text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">
                    <MapPin size={16} className="mr-3 text-brand-green/60" />
                    {gym.location}
                 </div>
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 px-2">Owner Information</h4>
              <div className="p-10 bg-white border border-slate-200/60 rounded-[2.5rem] grid grid-cols-2 gap-10 shadow-xl shadow-slate-200/20 ring-1 ring-slate-100/50">
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2.5 text-slate-500">
                       <User size={14} />
                       <p className="text-[10px] font-black uppercase tracking-widest">Partner Name</p>
                    </div>
                    <p className="text-xl font-black text-slate-950 uppercase leading-none">{gym.owner?.name || "Not Specified"}</p>
                 </div>
                 <div className="space-y-2 text-right">
                    <div className="flex items-center justify-end space-x-2.5 text-slate-500">
                       <Mail size={14} />
                       <p className="text-[10px] font-black uppercase tracking-widest">Email Address</p>
                    </div>
                    <p className="text-xs font-bold text-slate-600 truncate">{gym.owner?.email || "N/A"}</p>
                 </div>
                 <div className="col-span-2 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                          <Phone size={14} className="text-brand-green/80" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Channel</span>
                       </div>
                       <p className="text-xl font-black text-brand-green tracking-[0.2em] tabular-nums">{gym.owner?.phone || "VOID"}</p>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          {/* Right: Operational Details & Decisions */}
          <div className="space-y-12">
            <section className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 px-2">Compliance & KYC</h4>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "PAN CARD", value: gym.panNumber, icon: CreditCard, color: "text-brand-green", bg: "bg-white" },
                  { label: "LEGAL DOCS", value: gym.registrationDocUrl ? "UPLODED" : "MISSING", icon: Building, color: "text-blue-600", bg: "bg-white" },
                ].map((doc) => (
                  <div key={doc.label} className={cn("p-8 rounded-[1.8rem] border border-slate-200/60 space-y-3 transition-all hover:border-slate-400 shadow-xl shadow-slate-200/10 ring-1 ring-slate-100/50", doc.bg)}>
                     <doc.icon size={20} className={doc.color} />
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{doc.label}</p>
                        <p className="text-sm font-black text-slate-950 truncate uppercase">{doc.value || "VOID"}</p>
                     </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 bg-white rounded-[1.8rem] border border-slate-200/60 space-y-3 shadow-xl shadow-slate-200/10 ring-1 ring-slate-100/50">
                    <div className="flex items-center space-x-3 text-slate-500">
                       <Clock size={16} />
                       <p className="text-[9px] font-black uppercase tracking-widest">Opening Hours</p>
                    </div>
                    <p className="text-sm font-black text-slate-950 uppercase leading-none">{gym.openingTime || "06 AM"} - {gym.closingTime || "10 PM"}</p>
                 </div>
                 <div className="p-8 bg-white rounded-[1.8rem] border border-slate-200/60 space-y-3 shadow-xl shadow-slate-200/10 ring-1 ring-slate-100/50">
                    <div className="flex items-center space-x-3 text-slate-500">
                       <AlertCircle size={16} />
                       <p className="text-[9px] font-black uppercase tracking-widest">Weekly Holiday</p>
                    </div>
                    <p className="text-sm font-black text-slate-950 uppercase leading-none">{gym.weeklyOffDay || "NON-STOP"}</p>
                 </div>
              </div>

              {/* Activation Controls */}
              <div className="p-10 bg-slate-950 rounded-[3rem] space-y-10 relative overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/10 blur-[100px] -mr-24 -mt-24" />
                
                <div className="relative space-y-10">
                   <div className="flex justify-between items-center border-b border-white/5 pb-6">
                     <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-green leading-none">Setup Configuration</h4>
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Standard Fee:</span>
                        <span className="text-xs font-black text-white tabular-nums">₹{defaultOnboardingFee}</span>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Discount (%)</p>
                        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl focus-within:border-brand-green/40 transition-all shadow-inner">
                           <input 
                             type="number" 
                             placeholder="0"
                             value={discount}
                             onChange={(e) => setDiscount(e.target.value)}
                             className="bg-transparent border-none outline-none text-3xl font-black text-brand-green w-full placeholder:text-slate-800 tracking-tighter" 
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Final Onboarding Fee</p>
                        <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl focus-within:border-brand-green/40 transition-all shadow-inner">
                           <input 
                             type="number" 
                             value={setupFee}
                             onChange={(e) => setSetupFee(e.target.value)}
                             className="bg-transparent border-none outline-none text-3xl font-black text-white w-full placeholder:text-slate-800 tracking-tighter" 
                           />
                        </div>
                     </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Verification Notes</p>
                      <textarea 
                        placeholder="Explain the approval or rejection... e.g. Documentation verified."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 p-8 rounded-[2rem] focus:border-brand-green/40 transition-all shadow-inner text-sm font-bold text-slate-400 placeholder:text-slate-800 min-h-[120px] outline-none leading-relaxed"
                      />
                   </div>

                   <div className="flex gap-6 pt-4">
                     <button 
                       disabled={isPending}
                       onClick={handleReject}
                       className="flex-1 bg-white/5 border border-white/5 text-slate-500 font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-red-600/20 hover:text-red-500 transition-all active:scale-95 leading-none flex items-center justify-center space-x-2"
                     >
                       {isPending ? <Loader2 className="animate-spin" size={18} /> : "Reject Listing"}
                     </button>
                     <button 
                       disabled={isPending}
                       onClick={handleApprove}
                       className="flex-[2] bg-brand-green text-slate-950 font-black py-6 rounded-2xl text-[12px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-brand-green/30 active:scale-95 flex items-center justify-center space-x-3 leading-none"
                     >
                       {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                         <>
                           <span>Approve & Activate</span>
                           <ArrowLeft size={18} className="rotate-180" />
                         </>
                       )}
                     </button>
                   </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="h-20 bg-white border-t border-slate-100 flex items-center justify-between px-10">
         <div className="flex items-center space-x-4">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Verified Admin Access • Secure Hub</p>
         </div>
      </footer>
    </div>
  );
}
