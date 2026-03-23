"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, MapPin, Clock, ArrowRight, Eye, Store, AlertCircle 
} from "lucide-react";
import { GymReviewModal } from "../GymReviewModal";
import Image from "next/image";

export function VerificationDesk({ gyms, waitTime = "2.4 Hours" }: { gyms: any[], waitTime?: string }) {
  const [selectedGym, setSelectedGym] = useState<any>(null);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-10 px-4">
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Verification Desk</h2>
            <p className="text-sm font-medium text-slate-400">Review and verify incoming gym partner applications.</p>
         </div>
         <div className="flex items-center space-x-6 bg-zinc-900 border border-white/10 rounded-3xl px-8 py-5 shadow-3xl">
            <Clock size={20} className="text-orange-500" />
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avg Wait Time</p>
               <p className="text-lg font-black text-white tracking-tight">{waitTime}</p>
            </div>
         </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-950/50 border-b border-white/10">
              <tr>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Gym Hub & Identity</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Owner Contact</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Location</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Application Date</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-28 text-center bg-zinc-950/20">
                    <div className="flex flex-col items-center space-y-8 opacity-20">
                      <ShieldCheck size={72} strokeWidth={1} />
                      <p className="text-sm font-black uppercase tracking-[0.4em]">All applications cleared</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym: any) => (
                  <tr key={gym.id} className="hover:bg-zinc-900 transition-all group border-white/5">
                    <td className="p-10">
                      <div className="flex items-center space-x-6">
                         <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            {gym.imageUrls && gym.imageUrls[0] ? (
                               <Image src={gym.imageUrls[0]} alt="" width={64} height={64} className="object-cover w-full h-full" />
                            ) : (
                               <Store size={26} className="text-slate-600" />
                            )}
                         </div>
                         <div>
                            <div className="text-lg font-black text-white uppercase tracking-tight group-hover:text-brand-green transition-colors">{gym.name}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">HUB CODE: {gym.id.substring(0, 8).toUpperCase()}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="space-y-1.5">
                         <div className="text-sm font-black text-slate-200 tracking-wide uppercase">{gym.owner?.name || "Unnamed"}</div>
                         <div className="text-sm font-medium text-slate-400 lowercase">{gym.owner?.email}</div>
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="flex items-center text-sm font-black text-slate-400 uppercase tracking-tighter">
                         <MapPin size={16} className="mr-3 text-brand-blue" />
                         {gym.location}
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="space-y-1.5">
                         <div className="text-sm font-black text-slate-100 italic tracking-tight">{new Date(gym.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                         <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(gym.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      </div>
                    </td>
                    <td className="p-10 text-right">
                       <button 
                         onClick={() => setSelectedGym(gym)}
                         className="inline-flex items-center space-x-3 bg-white text-zinc-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-3xl hover:bg-brand-green transition-all active:scale-95 group/btn"
                       >
                          <span>Review Mode</span>
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-[2.5rem] p-10 flex items-start space-x-6 shadow-4xl shadow-brand-blue/5">
         <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center shrink-0 shadow-lg shadow-brand-blue/20">
            <AlertCircle size={24} className="text-zinc-950" />
         </div>
         <div className="space-y-2">
            <p className="text-[11px] font-black text-brand-blue uppercase tracking-[0.2em]">Compliance Protocol</p>
            <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
               High-resolution KYC documents are critical for GST-registered fitness centers. Ensure photos accurately represent the facility quality before granting premium status.
            </p>
         </div>
      </div>

      {selectedGym && (
        <GymReviewModal 
          gym={selectedGym} 
          isOpen={!!selectedGym} 
          onClose={() => setSelectedGym(null)} 
        />
      )}
    </div>
  );
}
