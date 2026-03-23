"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  ChevronLeft, Star, MapPin, Share2, Heart, ShieldCheck, 
  Zap, Info, Shield, ArrowRight 
} from "lucide-react";
import { BookingForm } from "@/components/bookings/BookingForm";

export function GymDetailClient({ gym }: { gym: any }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      
      {/* Container for Desktop Split Layout */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Visuals & Gallery */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="relative h-[400px] md:h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/5 group">
            <Image 
              src={gym.imageUrls[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070"} 
              alt={gym.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            
            {/* Action Buttons */}
            <div className="absolute top-6 left-6 flex space-x-4 z-20">
               <button className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <ChevronLeft size={24} />
               </button>
            </div>
            <div className="absolute top-6 right-6 flex space-x-4 z-20">
               <button className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <Share2 size={20} />
               </button>
               <button className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <Heart size={20} />
               </button>
            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-10 left-10 z-20 flex items-end space-x-4">
              <div className="bg-brand-green/20 backdrop-blur-3xl px-6 py-3 rounded-[2rem] border border-brand-green/30 flex items-center space-x-2">
                <Star size={20} className="fill-brand-green text-brand-green" />
                <span className="text-xl font-extrabold text-white">4.9</span>
                <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest pl-2 border-l border-white/10">Elite Partner</span>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Locker", "Showers", "AC", "Personal Trainer"].map((item) => (
              <div key={item} className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 flex flex-col items-center justify-center text-center space-y-3 hover:border-brand-green/30 transition-all group shadow-xl">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-brand-green group-hover:bg-brand-green/10 transition-all">
                   <Zap size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info & Booking */}
        <div className="w-full lg:w-2/5 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
               <ShieldCheck size={12} className="text-brand-blue" />
               <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">PassFit Verified Partner</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-white leading-[0.9] tracking-tighter uppercase">{gym.name}</h1>
            <div className="flex items-center text-zinc-400 text-sm font-medium">
              <MapPin size={16} className="mr-2 text-brand-green" />
              <span>{gym.location}</span>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-[2.5rem] bg-slate-900 border border-white/5 space-y-2 shadow-2xl">
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Starting Price</div>
               <div className="text-3xl font-extrabold font-heading text-white">₹{gym.plans[0]?.price || 299}</div>
            </div>
            <div className="p-6 rounded-[2.5rem] bg-slate-900 border border-white/5 space-y-2 shadow-2xl">
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Daily Access</div>
               <div className="text-3xl font-extrabold font-heading text-white">Valid</div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4 p-8 rounded-[3rem] bg-slate-900/40 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 blur-3xl rounded-full" />
             <h3 className="text-lg font-extrabold font-heading uppercase tracking-widest flex items-center text-white/90">
                <Info size={18} className="mr-2 text-brand-green" />
                ABOUT THIS HUB
             </h3>
             <p className="text-sm text-slate-500 leading-relaxed font-medium opacity-80">
                {gym.description} Experience luxury fitness with elite amenities and certified trainers. This facility is a premium PassFit partner offering instant daily access.
             </p>
          </div>

          {/* Booking Section */}
          <div className="space-y-6 pt-10 border-t border-white/5">
            <h3 className="text-2xl font-extrabold font-heading text-white uppercase tracking-tighter">CHOOSE YOUR HUB PASS</h3>
            <div className="space-y-4">
              {gym.plans.length > 0 ? gym.plans.map((plan: any) => (
                <div key={plan.id} className="group p-6 rounded-[2.5rem] bg-slate-900 border border-white/5 hover:border-brand-green/40 transition-all cursor-pointer flex justify-between items-center shadow-xl hover:shadow-brand-green/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-brand-green/10 flex items-center justify-center border border-brand-green/20 group-hover:bg-brand-green group-hover:text-white transition-all shadow-lg">
                       <Zap size={22} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white uppercase">{plan.type} Hub Pass</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">All Facilities Included</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold font-heading text-white group-hover:text-brand-green transition-colors">₹{plan.price}</div>
                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Inclusive GST</div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 font-bold text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-[2.5rem]">
                   No plans available for this hub yet.
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsBookingOpen(true)}
              className="w-full bg-gradient-to-r from-brand-blue/90 to-brand-green/90 text-white font-bold py-7 rounded-[2.5rem] shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center space-x-3 group backdrop-blur-sm"
            >
              <span>Instant Hub Access</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Safety Checklist */}
          <div className="flex items-center space-x-4 p-6 rounded-3xl bg-slate-950 border border-white/5 shadow-inner">
             <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
               <Shield size={24} />
             </div>
             <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-widest">
               PassFit Safety Verified<br/><span className="text-slate-600">ID Verification Required at Entrance</span>
             </p>
          </div>
        </div>
      </div>

      {/* Booking Form Overlay */}
      {isBookingOpen && (
        <BookingForm gym={gym} onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}
