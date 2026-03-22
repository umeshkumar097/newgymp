"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, Star, MapPin, Share2, Heart, ShieldCheck, 
  Zap, Info, Shield, ArrowRight, CheckCircle2, Clock 
} from "lucide-react";
import { gyms } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/bookings/BookingForm";
import { motion } from "framer-motion";

export default function GymDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const resolvedParams = React.use(params);
  const gym = gyms.find((g) => g.id === resolvedParams.id);

  if (!gym) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      
      {/* Container for Desktop Split Layout */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Visuals & Gallery */}
        <div className="w-full lg:w-3/5 space-y-6">
          <div className="relative h-[400px] md:h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image src={gym.image} alt={gym.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            
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
               <button className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <Heart size={20} />
               </button>
            </div>

            {/* Rating Badge */}
            <div className="absolute bottom-8 left-8 z-20 flex items-end space-x-4">
              <div className="bg-brand-green/20 backdrop-blur-3xl px-6 py-3 rounded-[2rem] border border-brand-green/30 flex items-center space-x-2">
                <Star size={20} className="fill-brand-green text-brand-green" />
                <span className="text-xl font-black text-white">{gym.rating}</span>
                <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest pl-2 border-l border-white/10">Top Rated</span>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {gym.amenities.map((item) => (
              <div key={item} className="p-4 rounded-3xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-green/30 transition-all group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-brand-green transition-colors">
                   <Zap size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400 group-hover:text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info & Booking */}
        <div className="w-full lg:w-2/5 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
               <ShieldCheck size={12} className="text-brand-blue" />
               <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">PassFit Verified</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black font-outfit text-white leading-none tracking-tighter uppercase">{gym.name}</h1>
            <div className="flex items-center text-zinc-400 text-sm font-medium">
              <MapPin size={16} className="mr-2 text-brand-green" />
              <span>{gym.location}</span>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 space-y-2">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Starting At</div>
               <div className="text-3xl font-black font-outfit text-white">{gym.price}</div>
            </div>
            <div className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 space-y-2">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Validity</div>
               <div className="text-3xl font-black font-outfit text-white">1 Day</div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4 p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5">
             <h3 className="text-lg font-black uppercase tracking-tight flex items-center">
                <Info size={18} className="mr-2 text-brand-green" />
                Gym Experience
             </h3>
             <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                {gym.description} Elevate your workout with cutting-edge equipment and a premium environment. Our day pass grants full access to cardio, strength, and sauna areas.
             </p>
          </div>

          {/* Booking Section */}
          <div className="space-y-6 pt-8 border-t border-white/5">
            <h3 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">Choose Your Plan</h3>
            <div className="space-y-4">
              {gym.plans.map((plan) => (
                <div key={plan.id} className="group p-6 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-brand-green/40 transition-all cursor-pointer flex justify-between items-center shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20 group-hover:bg-brand-green group-hover:text-white transition-all">
                       <Zap size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase">{plan.type} PASS</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Single Entry Included</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black font-outfit text-white group-hover:text-brand-green transition-colors">₹{plan.price}</div>
                    <div className="text-[9px] text-zinc-600 font-bold uppercase">Incl. GST</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsBookingOpen(true)}
              className="w-full bg-gradient-to-r from-brand-blue to-brand-green text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-brand-blue/20 hover:scale-[1.02] transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center space-x-3"
            >
              <span>Instant Access</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Safety Checklist */}
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-zinc-900 border border-white/5 shadow-inner">
             <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
               <Shield size={20} />
             </div>
             <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed">
               Verified by PassFit Safety Team. Carry valid ID for entry.
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
