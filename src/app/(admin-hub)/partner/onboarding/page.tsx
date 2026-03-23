"use client";

import React, { useState } from "react";
import { OnboardingStepper } from "@/components/partner/OnboardingStepper";
import { PartnerPhoneAuth } from "@/components/partner/PartnerPhoneAuth";
import { AgreementModal } from "@/components/partner/AgreementModal";
import { MapPin, Clock, Camera, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Upload, Trash2, Zap, Check, Eye, FileText, Ban } from "lucide-react";
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
    images: [] as string[],
    amenities: [] as string[],
    dayPassPrice: "",
    panNumber: "",
    bankAccount: "",
    ifscCode: "",
    panPhoto: "",
    chequePhoto: "",
    agreed: false
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "gym" | "kyc", field?: "panPhoto" | "chequePhoto") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsPending(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const body = new FormData();
        body.append("file", file);
        body.append("type", type);
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        return data.url as string;
      });

      const urls = await Promise.all(uploadPromises);
      
      if (field) {
        updateForm({ [field]: urls[0] });
      } else {
        updateForm({ images: [...formData.images, ...urls] });
      }
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
        setStep(7); // Success State
        setTimeout(() => router.push("/partner/dashboard"), 4000);
      }
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setIsPending(false);
    }
  };

  const amenitiesList = ["AC", "Parking", "Steam Bath", "Pool", "Locker", "Showers", "Cafeteria"];

  // Validation Logic
  const canContinue = () => {
    switch (step) {
      case 2: return formData.gymName.length > 2 && formData.location.length > 10;
      case 3: return formData.images.length >= 3;
      case 4: return parseInt(formData.dayPassPrice) > 0;
      case 5: return formData.panNumber.length === 10 && 
                     formData.bankAccount.length > 8 && 
                     formData.ifscCode.length === 11 && 
                     formData.panPhoto !== "" && 
                     formData.chequePhoto !== "" && 
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
      
      {/* Top Header */}
      <header className="py-10 text-center space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
          Partner <span className="text-brand-green">Onboarding</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Scale your fitness business with PassFit</p>
      </header>

      {/* Stepper */}
      <div className="max-w-4xl mx-auto mb-16 px-6">
        <OnboardingStepper currentStep={step > 5 ? 5 : step} />
      </div>

      {/* Form Container */}
      <main className="max-w-2xl mx-auto px-6">
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl min-h-[600px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/5 blur-3xl rounded-full" />

          <div className="relative z-10 h-full">
            {/* Step 1: Account */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-brand-green/10 flex items-center justify-center text-brand-green mx-auto border border-brand-green/20 shadow-xl shadow-brand-green/5">
                    <Zap size={32} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black uppercase tracking-tight">Identity Access</h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Verify your phone to start the application</p>
                  </div>
                </div>
                <PartnerPhoneAuth 
                  onSuccess={(phone) => {
                    updateForm({ phone });
                    setStep(2);
                  }} 
                />
              </div>
            )}

            {/* Step 2: Profile */}
            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase flex items-center tracking-tight italic">
                      <MapPin className="mr-4 text-brand-blue" size={32} />
                      Gym Hub Profile
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] px-12">Mandatory location and timing details</p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Official Gym Name *</label>
                      <input 
                        type="text" 
                        value={formData.gymName}
                        onChange={(e) => updateForm({ gymName: e.target.value })}
                        placeholder="e.g. Iron Paradise Fitness" 
                        className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm font-bold focus:border-brand-green/30 outline-none transition-all placeholder:text-zinc-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Full Operational Address *</label>
                      <textarea 
                        value={formData.location}
                        onChange={(e) => updateForm({ location: e.target.value })}
                        placeholder="Street, Area, City, Pincode" 
                        className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm font-bold focus:border-brand-green/30 outline-none transition-all h-32 resize-none placeholder:text-zinc-900" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Doors Open *</label>
                        <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex items-center focus-within:border-brand-blue/30 transition-all">
                          <Clock size={18} className="text-zinc-700 mr-4" />
                          <input type="time" value={formData.openTime} onChange={(e) => updateForm({ openTime: e.target.value })} className="bg-transparent border-none outline-none text-white font-black text-lg w-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Doors Close *</label>
                        <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl flex items-center focus-within:border-brand-blue/30 transition-all">
                          <Clock size={18} className="text-zinc-700 mr-4" />
                          <input type="time" value={formData.closeTime} onChange={(e) => updateForm({ closeTime: e.target.value })} className="bg-transparent border-none outline-none text-white font-black text-lg w-full" />
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Step 3: Media */}
            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase flex items-center tracking-tight italic">
                      <Camera className="mr-4 text-brand-green" size={32} />
                      Visual Identity
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] px-12">Minimum 3 high-quality photos required *</p>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((url, i) => (
                      <div key={i} className="aspect-square rounded-[2rem] bg-zinc-950 border border-white/5 relative group overflow-hidden">
                         <img src={url} className="w-full h-full object-cover" alt="gym" />
                         <button 
                          onClick={() => updateForm({ images: formData.images.filter((_, idx) => idx !== i) })}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                         >
                           <Trash2 size={24} className="text-white" />
                         </button>
                      </div>
                    ))}
                    {formData.images.length < 6 && (
                      <label className="aspect-square rounded-[2rem] bg-zinc-950 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green/30 hover:bg-brand-green/5 transition-all group">
                         {isPending ? <Loader2 size={24} className="animate-spin text-brand-green" /> : (
                           <>
                             <Upload size={24} className="text-zinc-700 group-hover:text-brand-green mb-3" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Add Photo</span>
                           </>
                         )}
                         <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, "gym")} className="hidden" />
                      </label>
                    )}
                 </div>

                 <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 px-1 font-outfit">Select Key Amenities</label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {amenitiesList.map(item => (
                        <button 
                          key={item}
                          onClick={() => {
                            const exists = formData.amenities.includes(item);
                            updateForm({ amenities: exists ? formData.amenities.filter(a => a !== item) : [...formData.amenities, item] });
                          }}
                          className={cn(
                            "px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                            formData.amenities.includes(item) ? "bg-brand-green border-brand-green text-zinc-950 shadow-lg shadow-brand-green/20" : "bg-zinc-950 border-white/5 text-zinc-600 hover:border-white/20"
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>
            )}

            {/* Step 4: Pricing */}
            {step === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 py-10">
                 <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-brand-blue/10 flex items-center justify-center text-brand-blue mx-auto border border-brand-blue/20 shadow-xl shadow-brand-blue/5">
                      <CreditCard size={32} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black uppercase tracking-tight">Access Pricing</h2>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Define the cost for a standard 1-Day Pass *</p>
                    </div>
                 </div>

                 <div className="p-16 bg-zinc-950 border border-white/5 rounded-[3rem] flex flex-col items-center space-y-6 shadow-inner">
                    <div className="flex items-center space-x-6">
                       <span className="text-7xl font-black text-zinc-800">₹</span>
                       <input 
                        type="number" 
                        value={formData.dayPassPrice}
                        onChange={(e) => updateForm({ dayPassPrice: e.target.value })}
                        placeholder="200" 
                        className="bg-transparent border-none outline-none text-8xl font-black text-brand-green w-64 text-center placeholder:text-zinc-900 selection:bg-brand-green/20" 
                       />
                    </div>
                    <div className="px-6 py-2 rounded-full bg-brand-green/5 border border-brand-green/10">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Revenue Share Tiers Apply</p>
                    </div>
                 </div>
              </div>
            )}

            {/* Step 5: KYC & Documents */}
            {step === 5 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase flex items-center tracking-tight italic">
                      <ShieldCheck className="mr-4 text-brand-green" size={32} />
                      KYC Compliance
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] px-12">All business and banking documents are mandatory *</p>
                 </div>

                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">PAN Card Number *</label>
                            <input type="text" value={formData.panNumber} onChange={(e) => updateForm({ panNumber: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm font-bold outline-none uppercase focus:border-brand-green/30" maxLength={10} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">PAN Card Photo *</label>
                            <label className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-green/30 transition-all overflow-hidden group">
                                <span className={cn("text-xs font-bold font-outfit truncate pr-4", formData.panPhoto ? "text-brand-green" : "text-zinc-700")}>
                                    {formData.panPhoto ? "File Uploaded ✅" : "Select image/pdf"}
                                </span>
                                <Upload size={16} className="text-zinc-800 group-hover:text-brand-green shrink-0" />
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "kyc", "panPhoto")} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Payout Bank Account *</label>
                                <input type="text" value={formData.bankAccount} onChange={(e) => updateForm({ bankAccount: e.target.value })} placeholder="Account Num" className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm font-bold outline-none focus:border-brand-blue/30" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">IFS Code *</label>
                                <input type="text" value={formData.ifscCode} onChange={(e) => updateForm({ ifscCode: e.target.value.toUpperCase() })} placeholder="HDFC0001234" className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-sm font-bold outline-none uppercase focus:border-brand-blue/30" maxLength={11} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Cancelled Cheque / Bank Proof (Photo) *</label>
                            <label className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-blue/30 transition-all overflow-hidden group">
                                <span className={cn("text-xs font-bold font-outfit truncate pr-4", formData.chequePhoto ? "text-brand-blue" : "text-zinc-700")}>
                                    {formData.chequePhoto ? "File Uploaded ✅" : "Select bank proof"}
                                </span>
                                <Upload size={16} className="text-zinc-800 group-hover:text-brand-blue shrink-0" />
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "kyc", "chequePhoto")} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div 
                        onClick={() => updateForm({ agreed: !formData.agreed })}
                        className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex items-start space-x-6 cursor-pointer group hover:bg-zinc-900/50 transition-all"
                    >
                        <div className={cn(
                        "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all mt-1 shrink-0",
                        formData.agreed ? "bg-brand-green border-brand-green" : "border-zinc-800"
                        )}>
                        {formData.agreed && <Check size={18} className="text-zinc-950 font-black" />}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">Legal Consent Required</p>
                            <p className="text-[10px] font-bold text-zinc-500 leading-relaxed">
                                I agree to the <span 
                                    onClick={(e) => { e.stopPropagation(); setIsAgreementOpen(true); }}
                                    className="text-brand-green underline uppercase tracking-widest font-black cursor-pointer hover:text-white transition-colors"
                                >
                                    Partner Tie-up Agreement (MoU)
                                </span> and authorize PassFit to verify my details and bank information.
                            </p>
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Step 6: Application Preview */}
            {step === 6 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mx-auto border border-brand-green/20 mb-4">
                        <Eye size={24} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight italic">Review Application</h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Verify all details before final submission</p>
                </div>

                <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5 space-y-2">
                           <p className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">Gym Name</p>
                           <p className="text-xs font-black uppercase text-white truncate">{formData.gymName}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5 space-y-2">
                           <p className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">Phone</p>
                           <p className="text-xs font-black uppercase text-white">{formData.phone}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5 space-y-2">
                           <p className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">1-Day Pass</p>
                           <p className="text-xs font-black uppercase text-brand-green italic">₹{formData.dayPassPrice}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5 space-y-2">
                           <p className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">Status</p>
                           <p className="text-xs font-black uppercase text-brand-blue">Ready to verify</p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 space-y-4">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-700 border-b border-white/5 pb-2">Documents Summary</h4>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-zinc-500 italic flex items-center"><FileText className="mr-2" size={12} /> PAN Verification</span>
                            <span className="text-brand-green">{formData.panNumber}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-zinc-500 italic flex items-center"><CreditCard className="mr-2" size={12} /> Bank Payouts</span>
                            <span className="text-brand-green">...{formData.bankAccount.slice(-4)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest pt-2">
                            <span className="text-zinc-500 italic">KYC Photos</span>
                            <span className="text-white">2 Files Attached</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-start space-x-4">
                        <ShieldCheck className="text-brand-blue mt-1 shrink-0" size={16} />
                        <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight">
                            By clicking submit, you confirm that all information provided is accurate. PassFit will verify these documents within 24 hours.
                        </p>
                    </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            {step > 1 && step < 7 && (
              <div className="flex gap-4 pt-10">
                <button 
                  onClick={() => setStep(prev => prev - 1)}
                  className="flex-1 bg-zinc-950 border border-white/10 text-white font-black py-6 rounded-[2rem] flex items-center justify-center space-x-3 active:scale-95 transition-all text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-900 shadow-xl"
                >
                  <ArrowLeft size={16} strokeWidth={3} />
                  <span>Back</span>
                </button>
                <button 
                  onClick={() => {
                    if (step === 6) handleFinalSubmit();
                    else if (canContinue()) setStep(prev => prev + 1);
                  }}
                  disabled={isPending || (step < 6 && !canContinue())}
                  className={cn(
                    "flex-[2.5] text-zinc-950 font-black py-6 rounded-[2rem] flex items-center justify-center space-x-3 active:scale-95 transition-all text-[10px] uppercase tracking-[0.4em] shadow-3xl shadow-brand-green/20 disabled:opacity-30 disabled:grayscale",
                    step === 6 ? "bg-white" : "bg-brand-green"
                  )}
                >
                  {isPending ? <Loader2 className="animate-spin text-zinc-950" size={24} strokeWidth={3} /> : (
                    <>
                      <span>{step === 6 ? "Transmit to PassFit" : "Continue"}</span>
                      <ArrowRight size={18} strokeWidth={4} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 7: Success */}
            {step === 7 && (
              <div className="flex flex-col items-center justify-center text-center space-y-8 pt-16 animate-in zoom-in duration-500">
                 <div className="relative">
                    <div className="absolute inset-0 bg-brand-green blur-[60px] opacity-20 rounded-full animate-pulse" />
                    <div className="w-32 h-32 rounded-[3.5rem] bg-brand-green/10 border-2 border-brand-green/20 flex items-center justify-center text-brand-green shadow-3xl shadow-brand-green/20 relative z-10">
                        <CheckCircle2 size={64} strokeWidth={1} />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Application Successful!</h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto">
                        Your tie-up agreement is digitally signed and under review.
                    </p>
                 </div>
                 
                 <div className="p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] space-y-4 max-w-sm w-full">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                            <Clock size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Review Time</p>
                            <p className="text-xs font-black text-white uppercase italic">&lt; 24 Working Hours</p>
                        </div>
                    </div>
                 </div>

                 <div className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em] animate-pulse pt-10">Initializing Status Center...</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
