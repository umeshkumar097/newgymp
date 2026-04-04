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
  Loader2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LaunchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-green/20 selection:text-slate-900">
      {/* Premium Light Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 p-6 flex justify-between items-center backdrop-blur-3xl bg-white/60 border-b border-slate-100">
         <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
               <Zap className="fill-white" size={24} />
            </div>
            <span className="text-xl font-extrabold uppercase tracking-tighter italic">Pass<span className="text-brand-green">Fit</span> Hub</span>
         </div>
         <div className="flex items-center space-x-6">
            <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Launch Mode Active</span>
            <div className="px-5 py-2 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
               Limited Time Offer
            </div>
         </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
         
         {/* Left Side: Marketing & Snaps (Light Theme) */}
         <div className="space-y-16">
            <div className="space-y-6">
               <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic text-slate-900">
                  Launch Your <span className="text-brand-green">Elite Hub</span> In Minutes.
               </h1>
               <p className="text-slate-400 text-lg md:text-xl font-bold uppercase tracking-widest leading-relaxed max-w-lg italic">
                  Partner with India's most premium fitness portal. Scale your gym's walk-ins automatically.
               </p>
            </div>

            {/* Dashboard Mockups Section (Light Style Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="relative group rounded-[3rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 aspect-square outline outline-8 outline-slate-50/50"
               >
                  <Image 
                    src="/.gemini/antigravity/brain/93fd0d38-1d56-43e5-be62-14917a73827f/dashboard_overview_snap_1775316678392.png" 
                    alt="Dashboard Snapshot" 
                    fill 
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent p-8 flex flex-col justify-end">
                     <h3 className="text-lg font-black uppercase tracking-tighter italic text-slate-900">Live Ledger</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time revenue tracking</p>
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.2 }}
                 className="relative group rounded-[3rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 aspect-square outline outline-8 outline-slate-50/50"
               >
                  <Image 
                    src="/.gemini/antigravity/brain/93fd0d38-1d56-43e5-be62-14917a73827f/otp_verification_snap_1775317023026.png" 
                    alt="OTP Verification" 
                    fill 
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent p-8 flex flex-col justify-end">
                     <h3 className="text-lg font-black uppercase tracking-tighter italic text-slate-900">Safe Entry</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smart 4-digit verification</p>
                  </div>
               </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { icon: ShieldCheck, title: "Secure Payouts", desc: "Weekly automated settlements" },
                 { icon: Users, title: "Targeted Growth", desc: "Corporate elite user base" },
                 { icon: Wallet, title: "0% Commission", desc: "Launch offer: 30 days free" }
               ].map((feat, i) => (
                 <div key={i} className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                       <feat.icon size={22} />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">{feat.title}</h3>
                       <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">{feat.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Right Side: Rapid Form (Light Theme Card) */}
         <div className="relative">
            <div className="bg-slate-50/50 border border-slate-100 rounded-[4rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 relative overflow-hidden backdrop-blur-3xl outline outline-8 outline-slate-50/50">
               
               {/* Subtle Light Accents */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-green/10 blur-[100px] pointer-events-none" />
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-200/30 blur-[100px] pointer-events-none" />

               <div className="relative space-y-12">
                  <div className="space-y-3">
                     <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Onboarding <span className="text-brand-green">Express</span></h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Complete this form to activate your hub</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Owner Name</label>
                           <div className="relative">
                              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                              <input 
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="JANE DOE"
                                className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:shadow-lg focus:shadow-brand-green/5 outline-none transition-all"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                           <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                              <input 
                                required
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="JANE@GYM.COM"
                                className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:shadow-lg focus:shadow-brand-green/5 outline-none transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">WhatsApp Number</label>
                           <div className="relative">
                              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                              <input 
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="91XXXXXXXXXX"
                                className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:shadow-lg focus:shadow-brand-green/5 outline-none transition-all"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Alternate Phone</label>
                           <div className="relative">
                              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200" size={18} />
                              <input 
                                name="altPhone"
                                value={formData.altPhone}
                                onChange={handleInputChange}
                                placeholder="91XXXXXXXXXX"
                                className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:outline-none opacity-60 transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8 pt-4">
                        <div className="h-[1px] bg-slate-100 w-full" />
                        
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-brand-green ml-2">Gym / Studio Name</label>
                           <div className="relative">
                              <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-green" size={20} />
                              <input 
                                required
                                name="gymName"
                                value={formData.gymName}
                                onChange={handleInputChange}
                                placeholder="ELITE FITNESS HUB"
                                className="w-full bg-white border border-brand-green/20 rounded-[1.8rem] py-6 pl-16 pr-6 text-lg font-black uppercase tracking-widest focus:border-brand-green focus:shadow-xl focus:shadow-brand-green/10 outline-none transition-all text-slate-900"
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Day Pass Price (₹)</label>
                           <div className="relative">
                              <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                              <input 
                                required
                                name="dayPassPrice"
                                type="number"
                                value={formData.dayPassPrice}
                                onChange={handleInputChange}
                                placeholder="499"
                                className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black uppercase tracking-widest focus:border-brand-green focus:shadow-lg focus:shadow-brand-green/5 outline-none transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Gym Showcase (3-4 Photos)</label>
                           <div className="grid grid-cols-4 gap-4">
                              {photos.map((p, i) => (
                                <div key={i} className="aspect-square rounded-2xl bg-white border border-brand-green/20 flex items-center justify-center overflow-hidden shadow-sm">
                                   <Image 
                                     src={URL.createObjectURL(p)} 
                                     alt="Preview" 
                                     width={100} 
                                     height={100} 
                                     className="object-cover w-full h-full"
                                   />
                                </div>
                              ))}
                              {photos.length < 4 && (
                                <label className="aspect-square rounded-2xl bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-green hover:bg-brand-green/5 transition-all text-slate-300 hover:text-brand-green group">
                                   <Camera size={24} className="group-hover:scale-110 transition-transform" />
                                   <span className="text-[9px] font-black mt-2 uppercase tracking-widest">ADD</span>
                                   <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                </label>
                              )}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Set Dashboard Password</label>
                           <div className="relative">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                              <input 
                                required
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-xs font-black tracking-widest focus:border-brand-green focus:shadow-lg focus:shadow-brand-green/5 outline-none transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     {error && (
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic animate-pulse">{error}</p>
                     )}

                     <button 
                       type="submit"
                       disabled={loading || photos.length < 1}
                       className="w-full bg-slate-900 text-white font-black py-7 rounded-[2.5rem] text-xs uppercase tracking-[0.4em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
                     >
                        {loading ? (
                           <>
                              <Loader2 className="animate-spin mr-3" size={20} />
                              {uploading ? "Uploading Presence..." : "Activating Hub..."}
                           </>
                        ) : (
                           <>
                              Launch My Hub
                              <ArrowRight className="ml-3" size={20} />
                           </>
                        )}
                     </button>

                     <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest text-center">
                        Wait time for activation: <span className="text-brand-green">0.0 Seconds</span>
                     </p>
                  </form>
               </div>
            </div>
         </div>
      </main>

      <footer className="py-16 border-t border-slate-100 text-center px-6 bg-slate-50/50">
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300">
            Official Launch Mode • PassFit Technologies Private Limited
         </p>
      </footer>
    </div>
  );
}
