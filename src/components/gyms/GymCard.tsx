import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface GymCardProps {
  gym: {
    id: string;
    name: string;
    distance: string;
    rating: string;
    price: string;
    image: string;
    trending?: boolean;
    tags?: string[];
  };
}

export function GymCard({ gym }: GymCardProps) {
  return (
    <Link href={`/gyms/${gym.id}`} className="block group">
      <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden hover:border-brand-green/30 transition-all duration-500 active:scale-[0.98] shadow-xl hover:shadow-brand-green/10 flex flex-col h-full bg-gradient-to-b from-transparent to-zinc-900/10">
        <div className="relative h-56 overflow-hidden">
          <Image 
            src={gym.image} 
            alt={gym.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-4 right-4 bg-zinc-950/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 border border-white/10 group-hover:border-brand-green/50 transition-colors">
            <Star size={14} className="fill-brand-green text-brand-green" />
            <span className="text-xs font-black text-white">{gym.rating}</span>
          </div>

          {gym.trending && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-brand-blue to-brand-green px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center space-x-1">
              <Zap size={10} className="fill-white" />
              <span>Trending</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-outfit font-black text-xl leading-tight text-white group-hover:text-brand-green transition-colors uppercase tracking-tight">{gym.name}</h3>
            </div>
            
            <div className="flex items-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest space-x-3">
              <span className="flex items-center">
                <MapPin size={12} className="mr-1 text-brand-blue" />
                {gym.distance}
              </span>
              {gym.tags && gym.tags.length > 0 && (
                <span className="flex items-center text-brand-green/80">
                  <ShieldCheck size={12} className="mr-1" />
                  {gym.tags[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-end pt-4 border-t border-white/5">
            <div>
              <span className="text-[8px] text-zinc-600 block uppercase tracking-widest font-black mb-1">Entry Pass</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-outfit font-black text-white">{gym.price}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">/Session</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-brand-green group-hover:text-white transition-all transform group-hover:rotate-12">
               <Zap size={20} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
