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
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-8">
         <div className="space-y-1">
            <h2 className="text-2xl font-extrabold font-heading text-white uppercase tracking-tighter">Verification Desk</h2>
            <p className="text-sm font-medium text-slate-500">Review and verify incoming gym partner applications.</p>
         </div>
         <div className="flex items-center space-x-4 bg-slate-900 border border-white/5 rounded-2xl px-6 py-4">
            <Clock size={18} className="text-orange-500" />
            <div>
               <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Average Wait Time</p>
               <p className="text-sm font-black text-white">{waitTime}</p>
            </div>
         </div>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/50 border-b border-white/5">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Gym Hub & Identity</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Owner Contact</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Location</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Application Date</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center space-y-6 opacity-20">
                      <ShieldCheck size={64} strokeWidth={1} />
                      <p className="text-sm font-bold uppercase tracking-[0.3em]">All applications cleared</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym: any) => (
                  <tr key={gym.id} className="hover:bg-slate-800/30 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center space-x-5">
                         <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                            {gym.imageUrls && gym.imageUrls[0] ? (
                               <Image src={gym.imageUrls[0]} alt="" width={64} height={64} className="object-cover w-full h-full" />
                            ) : (
                               <Store size={24} className="text-slate-600" />
                            )}
                         </div>
                         <div>
                            <div className="text-base font-black text-white uppercase tracking-tight group-hover:text-brand-green transition-colors">{gym.name}</div>
                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">ID: {gym.id.substring(0, 8)}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-1">
                         <div className="text-sm font-bold text-slate-200">{gym.owner?.name || "Unnamed"}</div>
                         <div className="text-[11px] font-medium text-slate-500 lowercase">{gym.owner?.email}</div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-tighter">
                         <MapPin size={14} className="mr-2 text-slate-600" />
                         {gym.location}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-1">
                         <div className="text-xs font-bold text-slate-300">{new Date(gym.createdAt).toLocaleDateString()}</div>
                         <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(gym.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                       <button 
                         onClick={() => setSelectedGym(gym)}
                         className="inline-flex items-center space-x-2 bg-white text-[#0F172A] px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-brand-green transition-all active:scale-95"
                       >
                          <span>Review Mode</span>
                          <ArrowRight size={14} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex items-start space-x-4">
         <AlertCircle size={20} className="text-brand-blue mt-0.5 shrink-0" />
         <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
            Compliance Note: High-resolution KYC documents are required for GST-registered fitness centers. Ensure photos accurately represent the facility quality before granting premium status.
         </p>
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
