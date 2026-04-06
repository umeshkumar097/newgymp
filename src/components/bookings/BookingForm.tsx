"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Check, ChevronRight, ShoppingBag, ShieldCheck, Loader2, LogIn, Lock, Calendar as CalendarIcon, ArrowLeft, Tag, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  gym: any;
  onClose: () => void;
}

type Step = "DETAILS" | "REVIEW" | "POLICY";

export function BookingForm({ gym, onClose }: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("DETAILS");
  const [selectedPlan] = useState(gym.plans[0]);
  const [memberCount, setMemberCount] = useState(1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Auth Sync
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setIsAuthenticated(data.loggedIn);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Generate next 14 available dates
  const availableDates = useMemo(() => {
    const dates = [];
    const start = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const toggleDate = (date: Date) => {
    const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
    if (isSelected) {
      setSelectedDates(prev => prev.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      if (selectedDates.length >= 10) return; // Limit to 10 days
      setSelectedDates(prev => [...prev, date].sort((a, b) => a.getTime() - b.getTime()));
    }
  };

  const totalAmount = useMemo(() => {
    const dailyPrice = selectedPlan?.price || 0;
    const dateMultiplier = Math.max(1, selectedDates.length);
    return dailyPrice * memberCount * dateMultiplier;
  }, [selectedPlan, memberCount, selectedDates]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gymId: gym.id,
          planId: selectedPlan.id,
          amount: totalAmount,
          members: memberCount,
          bookingDates: selectedDates.length > 0 ? selectedDates : [new Date()],
          coupon
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Booking failed");
      router.push(`/bookings/${result.bookingId}/success`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === "POLICY") {
    return (
      <div className="fixed inset-0 z-[110] bg-white flex flex-col p-8 md:p-12 font-sans selection:bg-brand-green/20">
         <div className="flex justify-between items-center mb-12">
            <button onClick={() => setStep("DETAILS")} className="p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 hover:bg-slate-100 transition-all flex items-center space-x-2">
              <ArrowLeft size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">PassFit Protocol</h2>
         </div>
         <div className="flex-1 overflow-y-auto space-y-12 max-w-2xl mx-auto py-10">
            <div className="space-y-4">
               <h1 className="text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none">Cancellation <br/><span className="text-brand-green">Policy</span></h1>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Standard Operating Procedure v4.0</p>
            </div>
            <div className="space-y-10 text-slate-600 font-medium leading-relaxed text-lg">
               <p>At PassFit, we prioritize flexibility for our members while ensuring sustainability for our gym partners. Our cancellation policy is designed to be fair and transparent.</p>
               <div className="space-y-6">
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="font-black text-slate-950 uppercase tracking-widest text-xs mb-4">Refund Window</p>
                    <p>Free cancellation is available up to 4 hours before the scheduled check-in time for any day pass.</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="font-black text-slate-950 uppercase tracking-widest text-xs mb-4">No-Show Terms</p>
                    <p>Failing to attend a booked session without prior cancellation will result in a full charge. Non-refundable after the check-in window opens.</p>
                  </div>
               </div>
               <p className="text-sm italic">For support, contact admin@aiclex.com</p>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-3xl flex items-end justify-center font-sans">
      <div className="w-full max-w-md bg-white rounded-t-[4rem] p-10 space-y-10 animate-in slide-in-from-bottom duration-700 shadow-2xl border-t border-slate-100 overflow-y-auto max-h-[92vh] scrollbar-hide relative pb-20">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-green">
                <ShoppingBag size={18} />
             </div>
             <div>
                <h2 className="text-lg font-black text-slate-950 uppercase tracking-tighter leading-none">
                  {step === "DETAILS" ? "Customize Pass" : "Review Access"}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                   <div className={cn("w-1.5 h-1.5 rounded-full", step === "DETAILS" ? "bg-brand-green" : "bg-slate-200")} />
                   <div className={cn("w-1.5 h-1.5 rounded-full", step === "REVIEW" ? "bg-brand-green" : "bg-slate-200")} />
                </div>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all border border-slate-100">
            <span className="text-xl font-bold">×</span>
          </button>
        </div>

        {step === "DETAILS" ? (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Multi-Date Selection */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Access Dates (Up to 10)</label>
                 <span className="text-slate-950 font-black text-[10px]">{selectedDates.length}/10</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableDates.map((date) => {
                  const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => toggleDate(date)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-1",
                        isSelected 
                          ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-95" 
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                      )}
                    >
                      <span className="text-[9px] font-black uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-md font-black">{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Members */}
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 block">Party Size</label>
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-3xl">
                 <button 
                   onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                   className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 active:scale-90 transition-transform shadow-sm"
                 >
                   <Minus size={20} />
                 </button>
                 <div className="text-center">
                    <span className="text-3xl font-black text-slate-950 tabular-nums">{memberCount}</span>
                    <p className="text-[8px] font-black text-brand-green uppercase tracking-widest mt-1">Members</p>
                 </div>
                 <button 
                   onClick={() => setMemberCount(memberCount + 1)}
                   className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-brand-green active:scale-90 transition-transform shadow-xl"
                 >
                   <Plus size={20} />
                 </button>
              </div>
            </div>

            {/* Cancellation Policy Trigger */}
            <div className="pt-4">
               <button 
                 onClick={() => setStep("POLICY")}
                 className="flex items-center space-x-3 text-slate-400 hover:text-slate-900 group transition-all"
               >
                  <Info size={16} />
                  <span className="text-[11px] font-black uppercase tracking-widest border-b border-dashed border-slate-200 pb-1">Read Cancellation Policy</span>
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-right duration-500">
             {/* Summary Review */}
             <div className="space-y-6">
                <div className="p-8 bg-slate-950 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-slate-200 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 blur-[60px] rounded-full" />
                   
                   <div className="space-y-4">
                      <p className="text-[9px] font-black text-brand-green uppercase tracking-[0.3em]">Operational Manifest</p>
                      <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">{gym.name}</h3>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Selected Period</p>
                         <p className="text-xs font-bold text-white uppercase">{selectedDates.length || 1} Day(s)</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entry Passes</p>
                         <p className="text-xs font-bold text-white uppercase">{memberCount} Member(s)</p>
                      </div>
                   </div>
                </div>

                {/* Offer Apply */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Apply Promo Code</label>
                   <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-2 rounded-2xl group transition-all focus-within:border-brand-green">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-300 group-focus-within:text-brand-green transition-colors">
                        <Tag size={20} />
                      </div>
                      <input 
                        type="text" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE" 
                        className="bg-transparent border-none outline-none text-xs font-black text-slate-900 w-full placeholder:text-slate-200 uppercase tracking-[0.3em]"
                      />
                      <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">Apply</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Global Footer (Req 2nd stage footer) */}
        <div className="fixed bottom-0 left-0 right-0 p-8 pb-10 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-between z-50">
           <div className="space-y-1">
              <div className="flex items-center space-x-2 text-slate-900">
                 <CalendarIcon size={14} className="text-brand-green" />
                 <span className="text-[11px] font-black uppercase tracking-widest">
                    {selectedDates.length || 1} <span className="text-slate-400">DATES</span> • {memberCount} <span className="text-slate-400">MEMBERS</span>
                 </span>
              </div>
              <div className="flex items-baseline space-x-1">
                 <span className="text-2xl font-black text-slate-950">₹{totalAmount}</span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Payable</span>
              </div>
           </div>

           {step === "DETAILS" ? (
             <button 
               onClick={() => setStep("REVIEW")}
               className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center space-x-3"
             >
                <span>Continue</span>
                <ChevronRight size={16} />
             </button>
           ) : (
             <button 
               disabled={loading || isAuthenticated === null}
               onClick={handleBooking}
               className={cn(
                 "bg-brand-green text-slate-950 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-brand-green/20 active:scale-95 transition-all flex items-center space-x-3",
                 (loading || isAuthenticated === null) && "opacity-50 cursor-not-allowed"
               )}
             >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                  <>
                    <span>Book Now</span>
                    <ShieldCheck size={16} />
                  </>
                )}
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
