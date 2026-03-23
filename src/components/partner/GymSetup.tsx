"use client";

import React, { useState } from "react";
import { Camera, CreditCard, Upload, Trash2, CheckCircle2, ArrowRight, Loader2, Zap, Package, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface GymSetupProps {
  gymId: string;
}

export function GymSetup({ gymId }: GymSetupProps) {
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  
  const [formData, setFormData] = useState({
    images: [] as string[],
    amenities: [] as string[],
    description: "",
    plans: [
        { type: "DAY", price: "200" },
        { type: "WEEK", price: "1000" },
        { type: "MONTH", price: "3000" }
    ]
  });

  const amenitiesList = ["AC", "Parking", "Steam Bath", "Pool", "Locker", "Showers", "Cafeteria"];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
      const res = await fetch("/api/partner/setup-gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-outfit">
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-3xl space-y-12">
            
            <div className="space-y-2 text-center">
                <div className="w-20 h-20 rounded-[2.5rem] bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green mx-auto mb-6 shadow-xl shadow-brand-green/10">
                    <Zap size={32} />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Design Your <span className="text-brand-green">Hub</span></h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Complete your profile to go live for customers</p>
            </div>

            {/* Step 1: Photos & Vibes */}
            {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 px-1">Studio Gallery (Min 3) *</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((url, i) => (
                                <div key={i} className="aspect-square rounded-[2rem] bg-zinc-950 border border-white/5 relative group overflow-hidden">
                                    <img src={url} className="w-full h-full object-cover" />
                                    <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={24} /></button>
                                </div>
                            ))}
                            {formData.images.length < 8 && (
                                <label className="aspect-square rounded-[2rem] bg-zinc-950 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green/50 transition-all group">
                                    <Upload size={24} className="text-zinc-700 group-hover:text-brand-green transition-colors" />
                                    <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 px-1">Hub Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Tell customers what makes your gym special..."
                            className="w-full bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] text-sm font-bold min-h-[150px] outline-none focus:border-brand-blue/30 transition-all resize-none"
                        />
                    </div>
                </div>
            )}

            {/* Step 2: Pricing Tiers */}
            {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 px-1">Pass Packaging *</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formData.plans.map((plan, i) => (
                                <div key={plan.type} className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 space-y-4 shadow-xl">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                        <span>{plan.type} PASS</span>
                                        <Package size={14} />
                                    </div>
                                    <div className="flex items-end space-x-2">
                                        <span className="text-zinc-800 text-3xl font-black mb-1">₹</span>
                                        <input 
                                            type="number" 
                                            value={plan.price}
                                            onChange={(e) => {
                                                const newPlans = [...formData.plans];
                                                newPlans[i].price = e.target.value;
                                                setFormData({ ...formData, plans: newPlans });
                                            }}
                                            className="bg-transparent border-none outline-none text-5xl font-black text-brand-green w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-brand-blue/5 border border-brand-blue/10 flex items-start space-x-4">
                        <Info className="text-brand-blue mt-1 shrink-0" size={18} />
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest leading-relaxed">
                            Competitive pricing helps you rank higher in search results. PassFit takes a flat commission ONLY after your 90-day grace period ends.
                        </p>
                    </div>
                </div>
            )}

            {/* Footer Navigation */}
            <div className="flex justify-between items-center">
                {step === 1 ? (
                    <div />
                ) : (
                    <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors">Previous</button>
                )}
                
                <button 
                    onClick={() => {
                        if (step === 1 && formData.images.length >= 3) setStep(2);
                        else if (step === 2) handleSave();
                    }}
                    disabled={isPending || (step === 1 && formData.images.length < 3)}
                    className="bg-brand-green text-zinc-950 px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-3xl shadow-brand-green/10 flex items-center space-x-3 active:scale-95 transition-all disabled:opacity-30"
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : (
                        <>
                            <span>{step === 2 ? "Go Live Now" : "Continue"}</span>
                            <ArrowRight size={14} strokeWidth={3} />
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}
