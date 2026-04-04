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
               <Zap size={18} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network Inventory</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Active <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Hubs</span></h2>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-none">Management of premium fitness portals across the ecosystem.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredGyms.length === 0 ? (
           <div className="col-span-full p-28 bg-white border border-slate-100 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center opacity-20 text-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-6">
                 <Store size={32} className="text-slate-400 stroke-1" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">No Active Hubs Discovered</p>
           </div>
        ) : (
          filteredGyms.map((gym: any) => (
            <div key={gym.id} className="bg-white border border-slate-200/60 rounded-[2rem] p-10 space-y-10 shadow-xl shadow-slate-200/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-700 ring-1 ring-slate-50">
               
               {/* Kill Switch Overlay (Refined Light) */}
               {gym.isPaused && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                     <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-xl shadow-red-100/50 animate-pulse">
                        <Power size={28} />
                     </div>
                     <div className="text-center space-y-2 px-12">
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Hub Deactivated</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Shielded from the marketplace.</p>
                     </div>
                     <button 
                        onClick={() => handleTogglePause(gym.id, true)}
                        className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-green hover:text-slate-950 transition-all shadow-xl active:scale-95"
                     >
                        Release Access
                     </button>
                  </div>
               )}

               <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-6">
                     <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm relative group-hover:scale-105 transition-transform duration-700 ring-1 ring-slate-50">
                        {gym.imageUrls && gym.imageUrls[0] ? (
                           <Image src={gym.imageUrls[0]} alt="" width={100} height={100} unoptimized className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                        ) : (
                           <Store size={28} className="text-slate-200 absolute inset-0 m-auto" />
                        )}
                        <div className="absolute top-2 right-2">
                           <div className={cn(
                             "w-2.5 h-2.5 rounded-full border-2 border-white shadow-xl",
                             gym.status === "SUSPENDED" ? "bg-red-500" : "bg-brand-green"
                           )} />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">{gym.name}</h3>
                        <p className="text-[10px] font-bold text-slate-500 flex items-center tracking-widest uppercase mb-1">
                           <MapPin size={12} className="mr-2 text-brand-green/60" />
                           {gym.location.substring(0, 30)}{gym.location.length > 30 ? "..." : ""}
                        </p>
                        <div className="flex items-center space-x-4 pt-1">
                           <div className="flex items-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                              <Clock size={10} className="mr-1.5 text-slate-400" />
                              <span>{gym.openingTime || "06 AM"} - {gym.closingTime || "10 PM"}</span>
                           </div>
                           <div className="flex items-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                              <Calendar size={10} className="mr-1.5 text-slate-400" />
                              <span>{gym.weeklyOffDay || "NON-STOP"}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                     <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all shadow-sm">
                        <MoreHorizontal size={18} />
                     </button>
                     <button 
                        onClick={() => handleTogglePause(gym.id, gym.isPaused)}
                        className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xl border",
                           gym.isPaused ? "bg-slate-950 text-white" : "bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white"
                        )}
                     >
                        <Power size={18} />
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-6 border-t border-slate-50 pt-10">
                  <div className="space-y-1.5">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center">
                        <Zap size={10} className="mr-1.5 text-brand-green/60" />
                        Reach
                     </p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{gym._count?.bookings || "0"} <span className="text-[9px] text-slate-400 font-bold ml-1 uppercase">Passes</span></p>
                  </div>
                  <div className="space-y-1.5 border-l border-slate-50 pl-6">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center">
                        <Star size={10} className="mr-1.5 text-blue-500/60" />
                        Rating
                     </p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{gym.avgRating ? gym.avgRating.toFixed(1) : "5.0"}</p>
                  </div>
                  <div className="space-y-1.5 text-right">
                     <p className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em] text-right underline underline-offset-4 decoration-brand-green/20">Net Share</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                        ₹{(gym.bookings?.reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0) * (commissionRate / 100)).toLocaleString()}
                     </p>
                  </div>
               </div>

               <div className="flex gap-3 pt-2 relative z-10">
                  <button 
                    onClick={() => router.push("/admin/analytics")}
                    className="flex-1 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-black py-4 rounded-xl text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 group shadow-sm"
                  >
                     <BarChart size={14} className="text-slate-400 group-hover:text-brand-green transition-colors" />
                     <span>Analytics</span>
                  </button>
                  <button 
                    onClick={() => router.push(`/admin/gyms/${gym.id}/verify`)}
                    className="flex-1 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-black py-4 rounded-xl text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 group shadow-sm"
                  >
                     <User size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                     <span>Review</span>
                  </button>
                  <button 
                    onClick={() => window.open(`/gyms/${gym.id}`, '_blank')}
                    className="w-16 bg-slate-900 text-white hover:bg-brand-green hover:text-slate-950 rounded-xl flex items-center justify-center transition-all group shadow-xl"
                  >
                     <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
               </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
