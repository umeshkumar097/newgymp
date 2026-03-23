"use client";

import React, { useState } from "react";
import { 
  Store, MapPin, Star, MoreHorizontal, Power, 
  ExternalLink, BarChart, Hash, Zap, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleGymPause } from "@/app/actions/admin";
import Image from "next/image";

export function ActiveHubs({ gyms }: { gyms: any[] }) {
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
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-8">
         <div className="space-y-1">
            <h2 className="text-2xl font-extrabold font-heading text-white uppercase tracking-tighter">Active Hubs</h2>
            <p className="text-sm font-medium text-slate-500">Manage live gym partners and facility operational status.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {gyms.filter(g => g.status === "APPROVED").length === 0 ? (
           <div className="col-span-full p-20 bg-slate-900 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center opacity-20">
              <Store size={48} className="mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">No active hubs found</p>
           </div>
        ) : (
          gyms.filter(g => g.status === "APPROVED").map((gym: any) => (
            <div key={gym.id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
               
               {/* Kill Switch Overlay */}
               {gym.isPaused && (
                  <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                     <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                        <Power size={32} />
                     </div>
                     <div className="text-center">
                        <p className="text-lg font-extrabold text-white uppercase tracking-tighter">Hub Suspended</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Hidden from PassFit Marketplace</p>
                     </div>
                     <button 
                        onClick={() => handleTogglePause(gym.id, true)}
                        className="bg-white text-[#0F172A] px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl"
                     >
                        Reactivate Hub
                     </button>
                  </div>
               )}

               <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-6">
                     <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-white/5 overflow-hidden shadow-2xl">
                        {gym.imageUrls && gym.imageUrls[0] ? (
                           <img src={gym.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                           <Store size={32} className="text-slate-600 m-6" />
                        )}
                     </div>
                     <div>
                        <div className="flex items-center space-x-3 mb-1">
                           <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">{gym.name}</h3>
                           <div className="px-2 py-0.5 rounded-md bg-brand-green/10 text-brand-green text-[9px] font-extrabold uppercase tracking-widest border border-brand-green/20">LIVE</div>
                        </div>
                        <p className="text-xs font-medium text-slate-500 flex items-center tracking-tight">
                           <MapPin size={12} className="mr-1.5" />
                           {gym.location}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <button className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center transition-all">
                        <MoreHorizontal size={20} />
                     </button>
                     <button 
                        onClick={() => handleTogglePause(gym.id, gym.isPaused)}
                        className={cn(
                           "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                           gym.isPaused ? "bg-white text-red-500" : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                        )}
                     >
                        <Power size={20} />
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center">
                        <Zap size={10} className="mr-1 text-orange-500" />
                        Passes Sold
                     </p>
                     <p className="text-2xl font-black text-white">{gym._count?.bookings || "242"}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center">
                        <Star size={10} className="mr-1 text-yellow-500" />
                        User Rating
                     </p>
                     <p className="text-2xl font-black text-white">{gym.avgRating?.toFixed(1) || "4.8"}</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Rev. Contribution</p>
                     <p className="text-2xl font-black text-brand-green">₹14.2k</p>
                  </div>
               </div>

               <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2">
                     <BarChart size={14} />
                     <span>Analytics</span>
                  </button>
                  <button className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2">
                     <User size={14} />
                     <span>Edit Profile</span>
                  </button>
                  <button className="w-12 bg-slate-800/50 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center transition-all">
                     <ExternalLink size={16} />
                  </button>
               </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
