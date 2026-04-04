"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, MapPin, Clock, ArrowRight, Store, Info 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function VerificationDesk({ 
  gyms, 
  waitTime = "2.4 Hours",
  defaultOnboardingFee = 4999
}: { 
  gyms: any[], 
  waitTime?: string,
  defaultOnboardingFee?: number 
}) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Verification Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-4">
         <div className="space-y-3">
            <div className="flex items-center space-x-3 text-brand-green">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Compliance Active</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Verification <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Desk</span></h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Reviewing India's most elite fitness hubs.</p>
         </div>
         
         <div className="flex items-center space-x-6 bg-white border border-slate-100 rounded-[1.8rem] px-8 py-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100/50">
               <Clock size={18} />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Wait Time</p>
               <p className="text-lg font-black text-slate-900 tracking-tighter italic tabular-nums">{waitTime}</p>
            </div>
         </div>
      </div>

      {/* Main Table Container (Less Bubbly) */}
      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden shadow-sm relative ring-1 ring-slate-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Hub Identity</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Owner Contact</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Territory</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Submission</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-28 text-center bg-white">
                    <div className="flex flex-col items-center space-y-6 opacity-20">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                         <ShieldCheck size={32} strokeWidth={1} className="text-slate-400" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Vault Cleared • 0 Pending</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym: any) => (
                  <tr key={gym.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="p-8">
                      <div className="flex items-center space-x-5">
                         <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                            {gym.imageUrls && gym.imageUrls[0] ? (
                               <Image src={gym.imageUrls[0]} alt="" width={56} height={56} className="object-cover w-full h-full opacity-80 group-hover:opacity-100" />
                            ) : (
                               <Store size={22} className="text-slate-200" />
                            )}
                         </div>
                         <div className="space-y-0.5">
                            <div className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-brand-green transition-colors italic leading-none">{gym.name}</div>
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ID: {gym.id.substring(0, 8).toUpperCase()}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-0.5">
                         <div className="text-sm font-black text-slate-700 tracking-wide uppercase italic leading-none">{gym.owner?.name || "Partner"}</div>
                         <div className="text-[10px] font-bold text-slate-400 lowercase tracking-tight italic">{gym.owner?.email}</div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-slate-600 transition-colors">
                         <MapPin size={14} className="mr-3 text-brand-green/30" />
                         {gym.location}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-0.5">
                         <div className="text-sm font-black text-slate-700 italic tracking-tight leading-none">{new Date(gym.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                         <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">AT {new Date(gym.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                       <Link 
                         href={`/admin/gyms/${gym.id}/verify`}
                         className="inline-flex items-center space-x-3 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-brand-green hover:text-slate-950 hover:scale-[1.02] transition-all active:scale-95 group/btn italic leading-none"
                       >
                          <span>Review Mode</span>
                          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Note (Refined) */}
      <div className="bg-white border border-slate-100 rounded-[1.8rem] p-8 flex items-start space-x-6 shadow-sm group ring-1 ring-slate-50">
         <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
            <Info size={20} className="text-brand-green" />
         </div>
         <div className="space-y-1.5">
            <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] italic leading-none">Security Protocol</p>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic leading-tight">
               Verified KYC documentation is mandatory for elite activation. audit media assets before granting enterprise status.
            </p>
         </div>
      </div>
    </div>
  );
}
