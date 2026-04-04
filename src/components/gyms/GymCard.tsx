import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface GymCardProps {
  gym: any; // Using any for Prism-include type simplicity or define the full type
}

export function GymCard({ gym }: GymCardProps) {
  const price = gym.plans?.[0]?.price || "299";
  const image = gym.imageUrls?.[0] || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070";

  return (
    <Link href={`/gyms/${gym.id}`} className="block group">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-brand-green transition-all duration-700 active:scale-[0.98] shadow-2xl shadow-slate-200/40 hover:shadow-brand-green/10 flex flex-col h-full relative">
        <div className="relative h-64 overflow-hidden">
          <Image 
            src={image} 
            alt={gym.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-5 right-5 bg-white/80 backdrop-blur-xl px-3 py-1.5 rounded-2xl flex items-center space-x-2 border border-slate-100 group-hover:border-brand-green/50 transition-all shadow-sm">
            <Star size={14} className="fill-brand-green text-brand-green" />
            <span className="text-[10px] font-extrabold text-slate-900">4.9</span>
          </div>

          <div className="absolute top-5 left-5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-100 text-brand-blue text-[8px] font-extrabold uppercase tracking-[0.2em] shadow-sm flex items-center space-x-2">
            <ShieldCheck size={12} fill="currentColor" className="text-brand-blue" />
            <span>Verified Hub</span>
          </div>
        </div>

        <div className="p-8 flex flex-col flex-1 justify-between space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-2xl leading-[0.9] text-slate-900 group-hover:text-brand-green transition-colors uppercase tracking-tight mb-3">{gym.name}</h3>
            
            <div className="flex items-center text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] space-x-3">
              <span className="flex items-center">
                <MapPin size={12} className="mr-1.5 text-brand-green" />
                {gym.location}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-50">
            <div>
              <span className="text-[8px] text-slate-400 block uppercase tracking-[0.3em] font-bold mb-1">Single Entry</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-heading font-extrabold text-slate-900 tracking-tighter">₹{price}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">/Session</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-brand-green group-hover:text-slate-900 transition-all transform group-hover:rotate-12 shadow-xl shadow-slate-200">
               <Zap size={22} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
