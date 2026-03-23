import React from "react";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function ExplorePage() {
  const gyms = await prisma.gym.findMany({
    where: { status: "APPROVED" },
    include: {
      plans: {
        orderBy: { price: "asc" },
        take: 1
      }
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] p-6 space-y-8 pb-32 font-sans">
      <div className="space-y-2 mt-8">
        <h1 className="text-4xl font-extrabold font-heading text-white tracking-tighter uppercase">EXPLORE</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 pl-1">Elite Fitness Hubs Near You</p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-green transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="SEARCH GYMS, MMA, CROSSFIT..." 
          className="w-full bg-slate-900/50 border border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-white text-xs font-bold focus:outline-none focus:border-brand-green/40 transition-all placeholder:text-slate-800 tracking-widest uppercase shadow-2xl"
        />
        <button className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-green">
          <Filter size={20} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-4">
        {["All Hubs", "Luxury Gyms", "Yoga Studios", "Swimming", "Crossfit", "Combat Ops"].map((cat) => (
          <button key={cat} className="whitespace-nowrap px-8 py-3 rounded-2xl bg-zinc-900 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white hover:border-brand-green/30 transition-all shadow-lg active:scale-95">
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-6">
        {gyms.length > 0 ? gyms.map((gym) => (
          <Link href={`/gyms/${gym.id}`} key={gym.id} className="group relative rounded-[2.5rem] bg-zinc-900/40 border border-white/5 p-5 flex space-x-6 active:scale-95 transition-all hover:bg-zinc-900 hover:border-brand-green/20 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-28 h-28 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 shrink-0">
               <Image 
                 src={gym.imageUrls[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070"} 
                 alt={gym.name} 
                 fill 
                 className="object-cover group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="flex-1 py-1 flex flex-col justify-between relative z-10">
               <div className="space-y-1">
                  <h3 className="font-extrabold font-heading text-white text-lg leading-tight tracking-tight uppercase">{gym.name}</h3>
                  <div className="flex items-center text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
                    <MapPin size={12} className="mr-1.5 text-brand-green" />
                    {gym.location}
                  </div>
               </div>
               <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-2 bg-white/5 px-2 py-0.5 rounded-lg">
                    <Star size={12} className="fill-brand-green text-brand-green" />
                    <span className="text-[10px] font-extrabold text-white">4.9</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Starting</span>
                    <div className="text-brand-green font-extrabold font-heading text-lg tracking-tighter">₹{gym.plans[0]?.price || 299}</div>
                  </div>
               </div>
            </div>
          </Link>
        )) : (
          <div className="py-20 text-center space-y-4 rounded-[3rem] border border-dashed border-white/10 bg-zinc-900/20">
             <div className="text-zinc-700 font-bold text-xs uppercase tracking-[0.5em]">No Elite Hubs Found</div>
             <p className="text-zinc-800 text-[10px] uppercase font-bold tracking-widest">We are currently auditing new partners in your area.</p>
          </div>
        )}
      </div>
    </div>
  );
}
