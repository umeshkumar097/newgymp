"use client";

import React, { useState } from "react";
import { OnboardingStepper } from "@/components/partner/OnboardingStepper";
import { PartnerPhoneAuth } from "@/components/partner/PartnerPhoneAuth";
import { AgreementModal } from "@/components/partner/AgreementModal";
import { MapPin, Clock, Camera, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Upload, Trash2, Zap, Check, Eye, FileText, Ban, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PartnerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    phone: "",
    gymName: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    openTime: "06:00",
    closeTime: "22:00",
    // Post-approval assets
    images: [] as string[],
    amenities: [] as string[],
    dayPassPrice: "0", 
    // KYC
    panNumber: "",
    bankAccount: "",
    ifscCode: "",
    panPhoto: "",
    chequePhoto: "",
    registrationDoc: "",
    agreed: false
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPending(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", "kyc");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      updateForm({ [field]: data.url });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsPending(true);
    try {
      const res = await fetch("/api/partner/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStep(5);
        setTimeout(() => router.push("/partner/dashboard"), 4000);
      }
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setIsPending(false);
    }
  };

  const canContinue = () => {
    switch (step) {
      case 2: return formData.gymName.length > 2 && formData.location.length > 10;
      case 3: return formData.panNumber.length >= 10 && 
                     formData.bankAccount.length >= 4 && 
                     formData.ifscCode.length >= 4 && 
                     formData.panPhoto !== "" && 
                     formData.chequePhoto !== "" && 
                     formData.registrationDoc !== "" &&
                     formData.agreed;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-outfit pb-32">
      <AgreementModal 
        isOpen={isAgreementOpen} 
        onClose={() => setIsAgreementOpen(false)} 
        data={{
          gymName: formData.gymName,
          address: formData.location,
          date: new Date().toISOString().split('T')[0]
        }}
      />
      
      <header className="py-10 text-center space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
          Partner <span className="text-brand-green">Onboarding</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Legal Tie-up & KYC Registration</p>
      </header>

      <div className="max-w-xl mx-auto mb-16 px-6">
        <div className="flex justify-between relative">
            {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center relative z-10">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500",
                        step >= s ? "bg-brand-green text-zinc-950 scale-110 shadow-lg shadow-brand-green/20" : "bg-zinc-900 text-zinc-600 border border-white/5"
                    )}>
                        {step > s ? <Check size={18} strokeWidth={4} /> : s}
                    </div>
                </div>
            ))}
            <div className="absolute top-5 left-0 w-full h-[1px] bg-zinc-900 -z-0" />
            <div 
                className="absolute top-5 left-0 h-[1px] bg-brand-green -z-0 transition-all duration-700" 
                style={{ width: `${((Math.min(step, 4) - 1) / 3) * 100}%` }}
            />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6">
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl min-h-[550px] flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 h-full">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-brand-green/10 flex items-center justify-center text-brand-green mx-auto border border-brand-green/20 shadow-xl shadow-brand-green/5">
                    <Zap size={32} />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Access Verification</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">Verify your phone to start the application</p>
                </div>
                <PartnerPhoneAuth 
                  onSuccess={(phone) => {
                    updateForm({ phone });
                    setStep(2);
                  }} 
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase flex items-center tracking-tight italic">
                      <Building className="mr-4 text-brand-blue" size={32} />
                      Business Info
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] px-12">Basic gym name and location details</p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Official Gym Name *</label>
                      <input type="text" value={formData.gymName} onChange={(e) => updateForm({ gymName: e.target.value })} placeholder="e.g. Iron Paradise Fitness" className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm font-bold focus:border-brand-green/30 outline-none transition-all placeholder:text-zinc-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Full Operational Address *</label>
                      <textarea value={formData.location} onChange={(e) => updateForm({ location: e.target.value })} placeholder="Street, Area, City, Pincode" className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm font-bold focus:border-brand-green/30 outline-none transition-all h-32 resize-none placeholder:text-zinc-900" />
                    </div>
                 </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase flex items-center tracking-tight italic">
                      <ShieldCheck className="mr-4 text-brand-green" size={32} />
                      Legal Tie-up
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] px-12">Submit documents for official verification</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">PAN Number *</label>
                        <input type="text" value={formData.panNumber} onChange={(e) => updateForm({ panNumber: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-xs font-black outline-none transition-all focus:border-brand-green/20" maxLength={10} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">PAN Card Photo *</label>
                        <label className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-green/30 transition-all overflow-hidden">
                            <span className={cn("text-[10px] font-black truncate pr-4", formData.panPhoto ? "text-brand-green" : "text-zinc-800 uppercase italic")}>
                                {formData.panPhoto ? "Uploaded ✅" : "Select image"}
                            </span>
                            <Upload size={14} className={formData.panPhoto ? "text-brand-green" : "text-zinc-800"} />
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "panPhoto")} className="hidden" />
                        </label>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Gym Registration Document (GST/Udyam/Trade) *</label>
                        <label className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-blue/30 transition-all overflow-hidden group">
                            <div className="flex items-center">
                                <FileText className={cn("mr-3", formData.registrationDoc ? "text-brand-blue" : "text-zinc-800")} size={18} />
                                <span className={cn("text-xs font-black uppercase", formData.registrationDoc ? "text-white" : "text-zinc-800 italic")}>
                                    {formData.registrationDoc ? "Doc Attached ✅" : "Upload Business Certificate"}
                                </span>
                            </div>
                            <Upload size={16} className="text-zinc-800 group-hover:text-brand-blue" />
                            <input type="file" accept="image/*,pdf" onChange={(e) => handleFileUpload(e, "registrationDoc")} className="hidden" />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Bank Account *</label>
                            <input type="text" value={formData.bankAccount} onChange={(e) => updateForm({ bankAccount: e.target.value })} placeholder="Account Num" className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-xs font-black outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">IFS Code *</label>
                            <input type="text" value={formData.ifscCode} onChange={(e) => updateForm({ ifscCode: e.target.value.toUpperCase() })} placeholder="HDFC000..." className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-xs font-black outline-none" maxLength={11} />
                        </div>
                    </div>

                    <div 
                        onClick={() => updateForm({ agreed: !formData.agreed })}
                        className="p-6 rounded-[2rem] bg-zinc-950 border border-white/5 flex items-start space-x-4 cursor-pointer group hover:bg-zinc-900/50 transition-all"
                    >
                        <div className={cn(
                        "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 shrink-0",
                        formData.agreed ? "bg-brand-green border-brand-green" : "border-zinc-800"
                        )}>
                        {formData.agreed && <Check size={16} className="text-zinc-950 font-black" />}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight">
                            I agree to the <span onClick={(e) => { e.stopPropagation(); setIsAgreementOpen(true); }} className="text-brand-green underline uppercase tracking-widest font-black cursor-pointer hover:text-white transition-colors">Partner Tie-up Agreement</span>
                        </p>
                    </div>
                 </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic">Final Review</h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Ready for PassFit submission</p>
                    <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/5 space-y-4 text-left">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-zinc-500">Business</span>
                            <span className="text-white">{formData.gymName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-zinc-500">KYC Status</span>
                            <span className="text-brand-green italic">Bundle Ready</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase italic">Notifications will be sent via WhatsApp and Email upon approval.</p>
              </div>
            )}

            {step > 1 && step < 5 && (
              <div className="flex gap-4 pt-10">
                <button onClick={() => setStep(prev => prev - 1)} className="flex-1 bg-zinc-950 border border-white/10 text-white font-black py-6 rounded-3xl text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">Back</button>
                <button onClick={() => { if (step === 4) handleFinalSubmit(); else if (canContinue()) setStep(prev => prev + 1); }} disabled={isPending || (step < 4 && !canContinue())} className={cn("flex-[2.5] text-zinc-950 font-black py-6 rounded-3xl text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all", step === 4 ? "bg-white" : "bg-brand-green")}>
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : (step === 4 ? "Submit Now" : "Continue")}
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center text-center space-y-8 pt-16 animate-in zoom-in duration-500">
                 <CheckCircle2 size={64} className="text-brand-green" />
                 <h2 className="text-4xl font-black uppercase tracking-tighter italic">Review Pending</h2>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Check your Email & WhatsApp for updates.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
