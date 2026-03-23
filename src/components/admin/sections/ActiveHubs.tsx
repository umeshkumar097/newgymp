"use client";

import React, { useState } from "react";
import { 
  Store, MapPin, Star, MoreHorizontal, Power, 
  ExternalLink, BarChart, Hash, Zap, User, Clock, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleGymPause } from "@/app/actions/admin";
import Image from "next/image";

import { useRouter } from "next/navigation";

export function ActiveHubs({ gyms }: { gyms: any[] }) {
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

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-10 px-4">
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Active Hubs</h2>
            <p className="text-sm font-medium text-slate-400">Manage live gym partners and facility operational status.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {activeGyms.filter((g: any) => g.status === "APPROVED" || g.status === "SUSPENDED").length === 0 ? (
           <div className="col-span-full p-28 bg-zinc-900 border border-white/10 border-dashed rounded-[3.5rem] flex flex-col items-center justify-center opacity-20 text-center">
              <Store size={72} className="mb-6 stroke-1" />
              <p className="text-sm font-black uppercase tracking-[0.4em]">No active hubs discovered</p>
           </div>
        ) : (
          activeGyms.filter((g: any) => g.status === "APPROVED" || g.status === "SUSPENDED").map((gym: any) => (
            <div key={gym.id} className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-3xl relative overflow-hidden group hover:border-white/20 transition-all">
               
               {/* Kill Switch Overlay */}
               {gym.isPaused && (
                  <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md z-10 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                     <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <Power size={36} />
                     </div>
                     <div className="text-center space-y-2 px-10">
                        <p className="text-2xl font-black text-white uppercase tracking-tighter italic">Hub Deactivated</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed">This facility is currently shielded from the public marketplace.</p>
                     </div>
                     <button 
                        onClick={() => handleTogglePause(gym.id, true)}
                        className="bg-white text-zinc-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-green transition-all shadow-3xl active:scale-95"
                     >
                        Reactivate Access
                     </button>
                  </div>
               )}

               <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-8">
                     <div className="w-24 h-24 rounded-3xl bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl relative">
                        {gym.imageUrls && gym.imageUrls[0] ? (
                           <img src={gym.imageUrls[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                           <Store size={36} className="text-slate-800 absolute inset-0 m-auto" />
                        )}
                     </div>
                     <div>
                        <div className="flex items-center space-x-4 mb-2">
                           <h3 className="text-2xl font-black text-white uppercase tracking-tight">{gym.name}</h3>
                           <div className={cn(
                             "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-inner",
                             gym.status === "SUSPENDED" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-brand-green/10 text-brand-green border-brand-green/20"
                           )}>{gym.status === "SUSPENDED" ? "SUSPENDED" : "LIVE"}</div>
                        </div>
                        <p className="text-sm font-medium text-slate-400 flex items-center tracking-tight mb-2">
                           <MapPin size={16} className="mr-2.5 text-brand-blue" />
                           {gym.location}
                        </p>
                        <div className="flex items-center space-x-4 pl-0.5">
                           <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Clock size={12} className="mr-1.5 text-zinc-600" />
                              <span>{gym.openingTime || "06:00 AM"} - {gym.closingTime || "10:00 PM"}</span>
                           </div>
                           <div className="h-3 w-[1px] bg-white/5" />
                           <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Calendar size={12} className="mr-1.5 text-zinc-600" />
                              <span>OFF: {gym.weeklyOffDay || "NONE"}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <button className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 text-slate-500 hover:text-white flex items-center justify-center transition-all hover:border-white/10 shadow-xl">
                        <MoreHorizontal size={22} />
                     </button>
                     <button 
                        onClick={() => handleTogglePause(gym.id, gym.isPaused)}
                        className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-3xl border",
                           gym.isPaused ? "bg-white text-red-500 border-white" : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                        )}
                     >
                        <Power size={22} />
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center">
                        <Zap size={12} className="mr-2 text-brand-green" />
                        Platform Reach
                     </p>
                     <p className="text-3xl font-black text-white tracking-tight">{gym._count?.bookings || "0"} <span className="text-[10px] text-slate-600 font-bold ml-1 uppercase">Passes</span></p>
                  </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center">
                         <Star size={12} className="mr-2 text-brand-blue" />
                         User Sentiment
                      </p>
                      <p className="text-3xl font-black text-white tracking-tight">{gym.avgRating ? gym.avgRating.toFixed(1) : "0.0"}</p>
                   </div>
                   <div className="space-y-2 text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Net Share</p>
                      <p className="text-3xl font-black text-brand-green tracking-tight italic">
                         ₹{gym.bookings?.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0) * 0.15 > 999 
                           ? `${((gym.bookings?.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0) * 0.15) / 1000).toFixed(1)}k`
                           : (gym.bookings?.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0) * 0.15 || 0).toFixed(0)}
                      </p>
                   </div>
               </div>

               <div className="flex gap-4 pt-4 relative z-0">
                  <button 
                    onClick={() => router.push("/admin/analytics")}
                    className="flex-1 bg-zinc-950 border border-white/5 hover:border-brand-green/30 text-slate-400 hover:text-white font-black py-4.5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 group relative overflow-hidden"
                  >
                     <BarChart size={16} className="text-brand-green group-hover:scale-110 transition-transform" />
                     <span>Analytics Deep-Dive</span>
                  </button>
                  <button 
                    onClick={() => router.push("/admin/users")}
                    className="flex-1 bg-zinc-950 border border-white/5 hover:border-brand-blue/30 text-slate-400 hover:text-white font-black py-4.5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 group"
                  >
                     <User size={16} className="text-brand-blue group-hover:scale-110 transition-transform" />
                     <span>Governance</span>
                  </button>
                  <button 
                    onClick={() => window.open(`/gym/${gym.id}`, '_blank')}
                    className="w-16 bg-zinc-950 border border-white/5 hover:border-white/20 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all group shadow-xl"
                  >
                     <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
               </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
