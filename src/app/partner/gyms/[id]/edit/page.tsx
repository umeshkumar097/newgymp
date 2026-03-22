"use client";

import React, { useState } from "react";
import { Camera, Plus, Trash2, MapPin, Check, ChevronRight, Store, DollarSign, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function GymEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const gymId = resolvedParams.id;
  const [activeStep, setActiveStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [plans, setPlans] = useState([
    { type: "DAY", price: 299 },
    { type: "WEEK", price: 1499 },
    { type: "MONTH", price: 3999 }
  ]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      
      const { uploadUrl, imageUrl } = await res.json();

      // 2. Upload to R2 (Mocking the Actual S3 Put for now)
      // In production: await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      
      console.log("Mock Upload Success:", imageUrl);
      setImages([...images, `https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400`]); // Still using unsplash as mock but with logic
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-10 pb-32">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black font-outfit text-white">Edit Gym Details</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Update your gym listing information</p>
      </div>

      {/* Mini Stepper */}
      <div className="flex space-x-2">
         {[1, 2, 3].map(i => (
           <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-500", activeStep === i ? "bg-orange-500" : "bg-zinc-800")} />
         ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeStep === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Gym Media (Photos)</h2>
               <div className="grid grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5">
                       <Image src={img} alt="" fill className="object-cover" />
                       <button 
                         onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                         className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-red-500"
                        >
                         <Trash2 size={14} />
                       </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-[2.5rem] bg-zinc-900 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center space-y-2 text-zinc-500 hover:border-orange-500/50 hover:text-orange-500 transition-all cursor-pointer">
                     <Camera size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                     <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
               </div>
            </div>

            <div className="space-y-4">
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Basic Info</h2>
               <div className="space-y-3">
                  <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 space-y-1">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Gym Name</label>
                     <input type="text" defaultValue="Muscle Factory" className="w-full bg-transparent border-none outline-none text-white font-bold placeholder:text-zinc-800" />
                  </div>
                  <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 space-y-1">
                     <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Address</label>
                     <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-orange-500" />
                        <input type="text" defaultValue="Sector 12, HSR Layout" className="w-full bg-transparent border-none outline-none text-white font-bold" />
                     </div>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setActiveStep(2)}
              className="w-full bg-white text-zinc-950 font-black py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              <span>Next: Pricing Plans</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-8">
            <div className="space-y-4">
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Pricing Strategy</h2>
               <div className="space-y-4">
                  {plans.map((plan, i) => (
                    <div key={plan.type} className="bg-zinc-900 border border-white/5 rounded-[2rem] p-6 flex justify-between items-center group">
                       <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                             <DollarSign size={20} />
                          </div>
                          <div>
                             <div className="text-sm font-black text-white uppercase tracking-tight">{plan.type} PASS</div>
                             <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Standard Entry</div>
                          </div>
                       </div>
                       <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-white">₹</span>
                          <input 
                            type="number" 
                            value={plan.price}
                            onChange={(e) => {
                               const newPlans = [...plans];
                               newPlans[i].price = parseInt(e.target.value);
                               setPlans(newPlans);
                            }}
                            className="w-20 bg-zinc-800/50 border border-zinc-700 rounded-xl px-3 py-2 text-white font-black text-right outline-none focus:border-orange-500" 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <button 
              onClick={() => setActiveStep(3)}
              className="w-full bg-white text-zinc-950 font-black py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              <span>Next: Amenities</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-8">
            <div className="space-y-4">
               <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Facilities & Features</h2>
               <div className="grid grid-cols-2 gap-3">
                  {["Cardio", "Strength", "Steam Bath", "Pool", "Locker", "Showers", "AC", "WiFi"].map((feature) => (
                    <div key={feature} className="p-4 rounded-3xl bg-zinc-900 border border-white/5 flex items-center space-x-3 cursor-pointer hover:border-orange-500/50 transition-all group">
                       <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                          <Check size={14} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-white">{feature}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 space-y-4">
                <div className="flex items-center space-x-3 text-orange-500">
                   <ListChecks size={20} />
                   <span className="font-black text-sm uppercase tracking-widest font-outfit">Ready to Sync</span>
                </div>
                <p className="text-[10px] text-orange-500/70 font-medium leading-relaxed uppercase tracking-tight">Updating your listing will sync across all discovery feeds and search results within 5 minutes.</p>
            </div>

            <button 
              className="w-full bg-orange-500 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-orange-500/30 flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
              onClick={() => {
                alert("Gym listing updated successfully!");
                setActiveStep(1);
              }}
            >
              <span>Save & Publish Changes</span>
              <Check size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
