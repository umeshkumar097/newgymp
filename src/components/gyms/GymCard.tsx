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
      <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-brand-green/30 transition-all duration-700 active:scale-[0.98] shadow-2xl hover:shadow-brand-green/10 flex flex-col h-full bg-gradient-to-b from-transparent to-zinc-900/10 relative">
        <div className="relative h-64 overflow-hidden">
          <Image 
            src={image} 
            alt={gym.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-5 right-5 bg-zinc-950/40 backdrop-blur-xl px-3 py-1.5 rounded-2xl flex items-center space-x-2 border border-white/10 group-hover:border-brand-green/50 transition-all shadow-xl">
            <Star size={14} className="fill-brand-green text-brand-green" />
            <span className="text-[10px] font-extrabold text-white">4.9</span>
          </div>

          <div className="absolute top-5 left-5 bg-brand-blue/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-brand-blue/20 text-brand-blue text-[8px] font-extrabold uppercase tracking-[0.2em] shadow-lg flex items-center space-x-2">
            <ShieldCheck size={12} fill="currentColor" className="text-brand-blue" />
            <span>Verified Hub</span>
          </div>
        </div>

        <div className="p-8 flex flex-col flex-1 justify-between space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-2xl leading-[0.9] text-white group-hover:text-brand-green transition-colors uppercase tracking-tight mb-3">{gym.name}</h3>
            
            <div className="flex items-center text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em] space-x-3 opacity-70">
              <span className="flex items-center">
                <MapPin size={12} className="mr-1.5 text-brand-green" />
                {gym.location}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-white/5">
            <div>
              <span className="text-[8px] text-zinc-600 block uppercase tracking-[0.3em] font-bold mb-1">Single Entry</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-heading font-extrabold text-white tracking-tighter">₹{price}</span>
                <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest pl-1">/Session</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-700 group-hover:bg-brand-green group-hover:text-zinc-950 group-hover:border-brand-green transition-all transform group-hover:rotate-12 shadow-inner group-hover:shadow-brand-green/20">
               <Zap size={22} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
