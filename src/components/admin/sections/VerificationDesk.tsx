"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, MapPin, Clock, ArrowRight, Store, Info 
} from "lucide-react";
import { GymReviewModal } from "../GymReviewModal";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function VerificationDesk({ 
  gyms, 
  waitTime = "2.4 Hours",
  defaultOnboardingFee = 4999
}: { 
  gyms: any[], 
  waitTime?: string,
  defaultOnboardingFee?: number 
}) {
  const [selectedGym, setSelectedGym] = useState<any>(null);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Verification Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-4">
         <div className="space-y-3">
            <div className="flex items-center space-x-3 text-brand-green">
               <ShieldCheck size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Compliance Protocol Active</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Verification <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Desk</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Reviewing India's most elite fitness hubs.</p>
         </div>
         
         <div className="flex items-center space-x-6 bg-white border border-slate-100 rounded-[2.5rem] px-8 py-6 shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
               <Clock size={22} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Wait Time</p>
               <p className="text-xl font-black text-slate-900 tracking-tighter italic">{waitTime}</p>
            </div>
         </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200/40 relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Hub Identity</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Owner Details</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Territory</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Submission</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-32 text-center bg-white">
                    <div className="flex flex-col items-center space-y-8 opacity-20">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                         <ShieldCheck size={48} strokeWidth={1} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-500 italic">Vault Cleared • 0 Pending</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym: any) => (
                  <tr key={gym.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="p-10">
                      <div className="flex items-center space-x-6">
                         <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                            {gym.imageUrls && gym.imageUrls[0] ? (
                               <Image src={gym.imageUrls[0]} alt="" width={64} height={64} className="object-cover w-full h-full opacity-90 group-hover:opacity-100" />
                            ) : (
                               <Store size={26} className="text-slate-300" />
                            )}
                         </div>
                         <div>
                            <div className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-brand-green transition-colors italic">{gym.name}</div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">ID: {gym.id.substring(0, 8).toUpperCase()}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="space-y-1">
                         <div className="text-sm font-black text-slate-700 tracking-wide uppercase italic">{gym.owner?.name || "Partner"}</div>
                         <div className="text-[11px] font-bold text-slate-400 lowercase tracking-tight italic">{gym.owner?.email}</div>
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest italic group-hover:text-slate-600 transition-colors">
                         <MapPin size={16} className="mr-3 text-brand-green/40" />
                         {gym.location}
                      </div>
                    </td>
                    <td className="p-10">
                      <div className="space-y-1">
                         <div className="text-sm font-black text-slate-700 italic tracking-tight">{new Date(gym.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                         <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Received AT {new Date(gym.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </td>
                    <td className="p-10 text-right">
                       <button 
                         onClick={() => setSelectedGym(gym)}
                         className="inline-flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-brand-green hover:scale-[1.02] transition-all active:scale-95 group/btn italic"
                       >
                          <span>Review Application</span>
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

      {/* Protocol Note */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-[3rem] p-10 flex items-start space-x-8 shadow-sm group">
         <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
            <Info size={24} className="text-brand-green" />
         </div>
         <div className="space-y-2">
            <p className="text-[11px] font-black text-brand-green uppercase tracking-[0.4em] italic underline decoration-brand-green/20 underline-offset-4">Quality Control Protocol</p>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic">
               High-resolution KYC documents are critical for elite verification. Ensure images accurately reflect facility premium standards before activation.
            </p>
         </div>
      </div>

      {selectedGym && (
        <GymReviewModal 
          gym={selectedGym} 
          isOpen={!!selectedGym} 
          onClose={() => setSelectedGym(null)} 
          defaultOnboardingFee={defaultOnboardingFee}
        />
      )}
    </div>
  );
}
