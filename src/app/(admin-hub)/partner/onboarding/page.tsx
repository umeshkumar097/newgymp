"use client";

import React, { useState } from "react";
import { OnboardingStepper } from "@/components/partner/OnboardingStepper";
import { PartnerPhoneAuth } from "@/components/partner/PartnerPhoneAuth";
import { AgreementModal } from "@/components/partner/AgreementModal";
import { MapPin, Clock, Camera, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Upload, Trash2, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PartnerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account (handled by OtpVerification separately or implicitly)
    phone: "",
    // Step 2: Profile
    gymName: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    openTime: "06:00",
    closeTime: "22:00",
    // Step 3: Media
    images: [] as string[],
    amenities: [] as string[],
    // Step 4: Pricing
    dayPassPrice: "",
    // Step 5: KYC
    panNumber: "",
    bankAccount: "",
    ifscCode: "",
    agreed: false
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsPending(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const body = new FormData();
        body.append("file", file);
        body.append("type", "gym");
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        return data.url as string;
      });

      const urls = await Promise.all(uploadPromises);
      updateForm({ images: [...formData.images, ...urls] });
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
        setStep(6); // Success State
        setTimeout(() => router.push("/partner/dashboard"), 3000);
      }
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setIsPending(false);
    }
  };

  const amenitiesList = ["AC", "Parking", "Steam Bath", "Pool", "Locker", "Showers", "Cafeteria"];

  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-outfit pb-20">
      <AgreementModal isOpen={isAgreementOpen} onClose={() => setIsAgreementOpen(false)} />
      {/* Top Header */}
      <header className="py-10 text-center space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Partner <span className="text-brand-green italic">Onboarding</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Launch your gym on PassFit in 10 minutes</p>
      </header>

      {/* Stepper */}
      <div className="max-w-4xl mx-auto mb-16">
        <OnboardingStepper currentStep={step} />
      </div>

      {/* Form Container */}
      <main className="max-w-2xl mx-auto px-6">
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl min-h-[500px] flex flex-col justify-between">
          
          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <Zap className="mx-auto text-brand-green" size={40} />
                <h2 className="text-2xl font-black uppercase">Verify Your Identity</h2>
                <p className="text-zinc-500 text-sm font-medium">Use your WhatsApp number to create a secure account.</p>
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase flex items-center">
                    <MapPin className="mr-3 text-brand-blue" />
                    Gym Profile
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Where is your fitness hub located?</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Gym Name</label>
                    <input 
                      type="text" 
                      value={formData.gymName}
                      onChange={(e) => updateForm({ gymName: e.target.value })}
                      placeholder="e.g. Iron Paradise Gym" 
                      className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-sm font-bold focus:border-brand-green/30 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Exact Location (Address)</label>
                    <textarea 
                      value={formData.location}
                      onChange={(e) => updateForm({ location: e.target.value })}
                      placeholder="Full address for users to find you" 
                      className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-sm font-bold focus:border-brand-green/30 outline-none transition-all h-32 resize-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Opens At</label>
                      <div className="bg-zinc-950 border border-white/5 p-5 rounded-2xl flex items-center">
                        <Clock size={16} className="text-zinc-600 mr-3" />
                        <input type="time" value={formData.openTime} onChange={(e) => updateForm({ openTime: e.target.value })} className="bg-transparent border-none outline-none text-white font-bold w-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Closes At</label>
                      <div className="bg-zinc-950 border border-white/5 p-5 rounded-2xl flex items-center">
                        <Clock size={16} className="text-zinc-600 mr-3" />
                        <input type="time" value={formData.closeTime} onChange={(e) => updateForm({ closeTime: e.target.value })} className="bg-transparent border-none outline-none text-white font-bold w-full" />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Step 3: Media */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase flex items-center">
                    <Camera className="mr-3 text-brand-green" />
                    Photos & Vibes
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Upload at least 3 high-quality photos</p>
               </div>

               <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((url, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-zinc-950 border border-white/5 relative group overflow-hidden">
                       <img src={url} className="w-full h-full object-cover" alt="gym" />
                       <button 
                        onClick={() => updateForm({ images: formData.images.filter((_, idx) => idx !== i) })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Trash2 size={12} />
                       </button>
                    </div>
                  ))}
                  {formData.images.length < 6 && (
                    <label className="aspect-square rounded-2xl bg-zinc-950 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green/30 transition-all group">
                       <Upload size={20} className="text-zinc-700 group-hover:text-brand-green" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-2">Upload</span>
                       <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Amenities (Select all that apply)</label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {amenitiesList.map(item => (
                      <button 
                        key={item}
                        onClick={() => {
                          const exists = formData.amenities.includes(item);
                          updateForm({ amenities: exists ? formData.amenities.filter(a => a !== item) : [...formData.amenities, item] });
                        }}
                        className={cn(
                          "px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                          formData.amenities.includes(item) ? "bg-brand-green border-brand-green text-zinc-950" : "bg-zinc-950 border-white/5 text-zinc-500"
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="text-center space-y-2">
                  <CreditCard className="mx-auto text-brand-blue" size={40} />
                  <h2 className="text-2xl font-black uppercase tracking-tight">Set Pass Price</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">How much do you charge for a 1-Day pass?</p>
               </div>

               <div className="p-10 bg-zinc-950 border border-white/5 rounded-[2.5rem] flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-4">
                     <span className="text-6xl font-black">₹</span>
                     <input 
                      type="number" 
                      value={formData.dayPassPrice}
                      onChange={(e) => updateForm({ dayPassPrice: e.target.value })}
                      placeholder="200" 
                      className="bg-transparent border-none outline-none text-7xl font-black text-brand-green w-48 text-center placeholder:text-zinc-900" 
                     />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Standard Price per Entry</p>
               </div>
            </div>
          )}

          {/* Step 5: KYC */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase flex items-center tracking-tight">
                    <ShieldCheck className="mr-3 text-brand-green" />
                    Legal Setup
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Verify identity and bank for payouts</p>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">PAN Card Number</label>
                    <input type="text" value={formData.panNumber} onChange={(e) => updateForm({ panNumber: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-sm font-bold outline-none uppercase" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Bank Account</label>
                      <input type="text" value={formData.bankAccount} onChange={(e) => updateForm({ bankAccount: e.target.value })} placeholder="Account Number" className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">IFSC Code</label>
                      <input type="text" value={formData.ifscCode} onChange={(e) => updateForm({ ifscCode: e.target.value.toUpperCase() })} placeholder="HDFC0001234" className="w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-sm font-bold outline-none uppercase" />
                    </div>
                  </div>
                  <div 
                    onClick={() => updateForm({ agreed: !formData.agreed })}
                    className="p-5 rounded-2xl bg-zinc-950 border border-white/5 flex items-start space-x-4 cursor-pointer group"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                      formData.agreed ? "bg-brand-green border-brand-green" : "border-zinc-800"
                    )}>
                      {formData.agreed && <Check size={14} className="text-zinc-950 font-black" />}
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400">
                      I agree to the <span 
                        onClick={(e) => { e.stopPropagation(); setIsAgreementOpen(true); }}
                        className="text-brand-green underline uppercase tracking-widest font-black cursor-pointer hover:text-white transition-colors"
                      >
                        Partner Tie-up Agreement
                      </span> and authorize PassFit to verify my details.
                    </p>
                  </div>
               </div>
            </div>
          )}

          {/* Navigation */}
          {step > 1 && step < 6 && (
            <div className="flex gap-4 pt-10">
              <button 
                onClick={() => setStep(prev => prev - 1)}
                className="flex-1 bg-zinc-950 border border-white/10 text-white font-black py-5 rounded-[2rem] flex items-center justify-center space-x-3 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button 
                onClick={() => step === 5 ? handleFinalSubmit() : setStep(prev => prev + 1)}
                disabled={isPending || (step === 3 && formData.images.length < 3) || (step === 5 && !formData.agreed)}
                className="flex-[2] bg-brand-green text-zinc-950 font-black py-5 rounded-[2rem] flex items-center justify-center space-x-3 active:scale-95 transition-all text-[10px] uppercase tracking-widest disabled:opacity-50"
              >
                {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>{step === 5 ? "Submit Application" : "Continue"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 pt-10 animate-in zoom-in duration-500">
               <div className="w-24 h-24 rounded-[3rem] bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shadow-3xl shadow-brand-green/20">
                  <CheckCircle2 size={48} />
               </div>
               <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Profile Submitted!</h2>
                  <p className="text-zinc-500 text-sm font-medium max-w-sm mx-auto">
                    Thank you! Your profile is under review by the PassFit Team. We will activate your account within 24 hours.
                  </p>
               </div>
               <div className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] animate-pulse">Redirecting to Status Center...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
