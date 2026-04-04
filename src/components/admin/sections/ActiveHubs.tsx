"use client";

import React, { useState } from "react";
import { 
  Store, MapPin, Star, MoreHorizontal, Power, 
  ExternalLink, BarChart, Zap, User, Clock, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleGymPause } from "@/app/actions/admin";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ActiveHubs({ gyms, commissionRate = 15 }: { gyms: any[], commissionRate?: number }) {
  const router = useRouter();
  const [activeGyms, setActiveGyms] = useState(gyms);

  const handleTogglePause = async (gymId: string, currentPaused: boolean) => {
    setActiveGyms(prev => prev.map(g => g.id === gymId ? { ...g, isPaused: !currentPaused } : g));
    const res = await toggleGymPause(gymId, !currentPaused);
    if (!res.success) {
      alert(res.error);
      setActiveGyms(prev => prev.map(g => g.id === gymId ? { ...g, isPaused: currentPaused } : g));
    }
  };

  const filteredGyms = activeGyms.filter((g: any) => g.status === "APPROVED" || g.status === "SUSPENDED");

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-4">
         <div className="space-y-3">
            <div className="flex items-center space-x-3 text-brand-green">
               <Store size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network Live</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Active <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Hubs</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">India's most premium fitness portal inventory.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredGyms.length === 0 ? (
           <div className="col-span-full p-32 bg-white border border-slate-100 border-dashed rounded-[4.5rem] flex flex-col items-center justify-center opacity-20 text-center">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-8">
                 <Store size={48} className="text-slate-400 stroke-1" />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-500 italic">No Active Hubs Discovered</p>
           </div>
        ) : (
          filteredGyms.map((gym: any) => (
            <div key={gym.id} className="bg-white border border-slate-100 rounded-[3.5rem] p-10 space-y-10 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
               
               {/* Kill Switch Overlay (Premium Light Version) */}
               {gym.isPaused && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xl z-10 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                     <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-xl shadow-red-100/50 animate-pulse">
                        <Power size={36} />
                     </div>
                     <div className="text-center space-y-3 px-12">
                        <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Hub Locked</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">This facility is currently shielded from the public portal.</p>
                     </div>
                     <button 
                        onClick={() => handleTogglePause(gym.id, true)}
                        className="bg-slate-900 text-white px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-green transition-all shadow-xl active:scale-95 italic"
                     >
                        Release Access
                     </button>
                  </div>
               )}

               <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-8">
                     <div className="w-28 h-28 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-sm relative group-hover:scale-105 transition-transform duration-700 ring-1 ring-slate-50">
                        {gym.imageUrls && gym.imageUrls[0] ? (
                           <Image src={gym.imageUrls[0]} alt="" width={112} height={112} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                        ) : (
                           <Store size={36} className="text-slate-200 absolute inset-0 m-auto" />
                        )}
                        <div className="absolute top-3 right-3">
                           <div className={cn(
                             "w-3 h-3 rounded-full border-2 border-white shadow-xl",
                             gym.status === "SUSPENDED" ? "bg-red-500" : "bg-brand-green"
                           )} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                           <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">{gym.name}</h3>
                        </div>
                        <p className="text-xs font-bold text-slate-400 flex items-center tracking-widest uppercase italic">
                           <MapPin size={14} className="mr-3 text-brand-green/30" />
                           {gym.location}
                        </p>
                        <div className="flex items-center space-x-6 pt-2">
                           <div className="flex items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                              <Clock size={12} className="mr-2 text-slate-200" />
                              <span>{gym.openingTime || "06:00 AM"} - {gym.closingTime || "10:00 PM"}</span>
                           </div>
                           <div className="flex items-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                              <Calendar size={12} className="mr-2 text-slate-200" />
                              <span>OFF {gym.weeklyOffDay || "NONE"}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                     <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all hover:shadow-lg">
                        <MoreHorizontal size={22} />
                     </button>
                     <button 
                        onClick={() => handleTogglePause(gym.id, gym.isPaused)}
                        className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl border",
                           gym.isPaused ? "bg-slate-900 text-white" : "bg-red-50/50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white"
                        )}
                     >
                        <Power size={22} />
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-8 border-t border-slate-50 pt-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center italic">
                        <Zap size={12} className="mr-2 text-brand-green/30" />
                        Network Reach
                     </p>
                     <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{gym._count?.bookings || "0"} <span className="text-[10px] text-slate-300 font-bold ml-1 uppercase">Passes</span></p>
                  </div>
                  <div className="space-y-2 border-l border-slate-50 pl-8">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center italic">
                        <Star size={12} className="mr-2 text-blue-500/30" />
                        Sentiment
                     </p>
                     <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{gym.avgRating ? gym.avgRating.toFixed(1) : "5.0"}</p>
                  </div>
                  <div className="space-y-2 text-right">
                     <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] italic underline decoration-brand-green/10 underline-offset-4 text-right">Net Rev Share</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
                        ₹{(gym.bookings?.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0) * (commissionRate / 100)).toLocaleString()}
                     </p>
                  </div>
               </div>

               <div className="flex gap-4 pt-4 relative z-0">
                  <button 
                    onClick={() => router.push("/admin/analytics")}
                    className="flex-1 bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 text-slate-400 hover:text-slate-900 font-black py-5 rounded-[1.8rem] text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center space-x-3 group italic shadow-inner"
                  >
                     <BarChart size={16} className="text-slate-300 group-hover:text-brand-green transition-colors" />
                     <span>Analytics Hub</span>
                  </button>
                  <button 
                    onClick={() => router.push("/admin/users")}
                    className="flex-1 bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 text-slate-400 hover:text-slate-900 font-black py-5 rounded-[1.8rem] text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center space-x-3 group italic shadow-inner"
                  >
                     <User size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                     <span>Governance Control</span>
                  </button>
                  <button 
                    onClick={() => window.open(`/gym/${gym.id}`, '_blank')}
                    className="w-20 bg-slate-900 text-white hover:bg-brand-green hover:text-slate-900 rounded-[1.8rem] flex items-center justify-center transition-all group shadow-xl"
                  >
                     <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
               </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
