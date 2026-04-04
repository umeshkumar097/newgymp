"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  ShieldCheck, 
  Target, 
  Users, 
  Wallet, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  Lock,
  Phone,
  Mail,
  User,
  Building2,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LaunchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    altPhone: "",
    password: "",
    gymName: "",
    dayPassPrice: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles].slice(0, 4));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Upload Photos first
      setUploading(true);
      const imageUrls: string[] = [];
      
      for (const photo of photos) {
        const uploadData = new FormData();
        uploadData.append("file", photo);
        uploadData.append("type", "gym");
        
        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData
        });
        const data = await res.json();
        if (data.url) imageUrls.push(data.url);
      }
      setUploading(false);

      // 2. Submit Rapid Onboarding
      const res = await fetch("/api/partner/rapid-onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrls
        })
      });

      const data = await res.json();

      if (data.success) {
        router.push("/partner/dashboard");
      } else {
        setError(data.error || "Launch failed. Please check your details.");
      }
    } catch (err) {
      setError("System error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand-green/30 selection:text-white">
      {/* Premium Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 p-6 flex justify-between items-center backdrop-blur-md bg-zinc-950/20 border-b border-white/5">
         <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-950 shadow-xl">
               <Zap className="fill-zinc-950" size={24} />
            </div>
            <span className="text-xl font-extrabold uppercase tracking-tighter italic">Pass<span className="text-brand-green">Fit</span> Hub</span>
         </div>
         <div className="flex items-center space-x-6">
            <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Launch Mode Active</span>
            <div className="px-4 py-2 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
               Limited Time Offer
            </div>
         </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
         
         {/* Left Side: Marketing & Snaps */}
         <div className="space-y-16">
            <div className="space-y-6">
               <h1 className="text-6xl md:text-8xl font-extrabold uppercase tracking-tighter leading-[0.8] italic">
                  Launch Your <span className="text-brand-green">Elite Hub</span> In Minutes.
               </h1>
               <p className="text-zinc-500 text-lg md:text-xl font-bold uppercase tracking-widest leading-relaxed max-w-lg italic">
                  Partner with India's most premium fitness portal. Scale your gym's walk-ins automatically.
               </p>
            </div>

            {/* Dashboard Mockups Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 className="relative group rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden shadow-2xl aspect-square"
               >
                  <Image 
                    src="/.gemini/antigravity/brain/93fd0d38-1d56-43e5-be62-14917a73827f/dashboard_overview_snap_1775316678392.png" 
                    alt="Dashboard Snapshot" 
                    fill 
                    className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent p-8 flex flex-col justify-end">
                     <h3 className="text-lg font-black uppercase tracking-tighter italic">Live Ledger</h3>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Real-time revenue tracking</p>
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="relative group rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden shadow-2xl aspect-square"
               >
                  <Image 
                    src="/.gemini/antigravity/brain/93fd0d38-1d56-43e5-be62-14917a73827f/otp_verification_snap_1775317023026.png" 
                    alt="OTP Verification" 
                    fill 
                    className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent p-8 flex flex-col justify-end">
                     <h3 className="text-lg font-black uppercase tracking-tighter italic">Safe Entry</h3>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Smart 4-digit verification</p>
                  </div>
               </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { icon: ShieldCheck, title: "Secure Payouts", desc: "Weekly automated settlements" },
                 { icon: Users, title: "Targeted Growth", desc: "Corporate elite user base" },
                 { icon: Wallet, title: "0% Commission", desc: "Launch offer: 30 days free" }
               ].map((feat, i) => (
                 <div key={i} className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                       <feat.icon size={20} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest">{feat.title}</h3>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>

         {/* Right Side: Rapid Form */}
         <div className="relative">
            {/* Sticky Container */}
            <div className="bg-zinc-900 border border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-[0_0_100px_-20px_rgba(34,197,94,0.1)] relative overflow-hidden">
               {/* Glowing Accents */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-green/5 blur-[100px] pointer-events-none" />
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none" />

               <div className="relative space-y-10">
                  <div className="space-y-2 text-center md:text-left">
                     <h2 className="text-3xl font-extrabold uppercase tracking-tighter italic">Onboarding <span className="text-brand-green">Express</span></h2>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Complete this form to launch your hub</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     
                     {/* Identity Section */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Owner Name</label>
                           <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                              <input 
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="JANE DOE"
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:outline-none transition-all"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Email Address</label>
                           <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                              <input 
                                required
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="JANE@GYM.COM"
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:outline-none transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">WhatsApp Number</label>
                           <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                              <input 
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="91XXXXXXXXXX"
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:outline-none transition-all"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Alternate Phone</label>
                           <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 opacity-30" size={16} />
                              <input 
                                name="altPhone"
                                value={formData.altPhone}
                                onChange={handleInputChange}
                                placeholder="91XXXXXXXXXX"
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:outline-none opacity-50 transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Gym Section */}
                     <div className="space-y-6 pt-4">
                        <div className="h-[1px] bg-white/5 w-full" />
                        
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-brand-green ml-2">Gym / Studio Name</label>
                           <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green" size={16} />
                              <input 
                                required
                                name="gymName"
                                value={formData.gymName}
                                onChange={handleInputChange}
                                placeholder="ELITE FITNESS HUB"
                                className="w-full bg-zinc-950 border border-brand-green/30 rounded-2xl py-5 pl-12 pr-4 text-md font-extrabold uppercase tracking-widest focus:border-brand-green focus:outline-none transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Day Pass Price (₹)</label>
                           <div className="relative">
                              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                              <input 
                                required
                                name="dayPassPrice"
                                type="number"
                                value={formData.dayPassPrice}
                                onChange={handleInputChange}
                                placeholder="499"
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:outline-none transition-all"
                              />
                           </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Gym Showcase (3-4 Photos)</label>
                           <div className="grid grid-cols-4 gap-2">
                              {photos.map((p, i) => (
                                <div key={i} className="aspect-square rounded-xl bg-zinc-950 border border-brand-green/30 flex items-center justify-center overflow-hidden">
                                   <Image 
                                     src={URL.createObjectURL(p)} 
                                     alt="Preview" 
                                     width={80} 
                                     height={80} 
                                     className="object-cover w-full h-full"
                                   />
                                </div>
                              ))}
                              {photos.length < 4 && (
                                <label className="aspect-square rounded-xl bg-zinc-950 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green/50 transition-all text-zinc-500 hover:text-brand-green">
                                   <Camera size={20} />
                                   <span className="text-[8px] font-black mt-1">ADD</span>
                                   <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                </label>
                              )}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Set Dashboard Password</label>
                           <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                              <input 
                                required
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black tracking-widest focus:border-brand-green focus:outline-none transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     {error && (
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">{error}</p>
                     )}

                     <button 
                       type="submit"
                       disabled={loading || photos.length < 1}
                       className="w-full bg-brand-green text-white font-black py-6 rounded-[2rem] text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_-15px_rgba(34,197,94,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
                     >
                        {loading ? (
                           <>
                              <Loader2 className="animate-spin mr-3" size={18} />
                              {uploading ? "Uploading Presence..." : "Activating Hub..."}
                           </>
                        ) : (
                           <>
                              Launch My Hub
                              <ArrowRight className="ml-3" size={18} />
                           </>
                        )}
                     </button>

                     <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-center">
                        Wait time for dashboard activation: 0 Seconds
                     </p>
                  </form>
               </div>
            </div>
         </div>
      </main>

      {/* Trust Footer */}
      <footer className="py-12 border-t border-white/5 text-center px-6">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">
            Official Launch Mode • PassFit Technologies Private Limited
         </p>
      </footer>
    </div>
  );
}
