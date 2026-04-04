"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, MapPin, Clock, ArrowRight, Store, Info, AlertCircle, CheckCircle2, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function VerificationDesk({ 
  gyms, 
  waitTime = "1.8 Hours",
  defaultOnboardingFee = 4999 
}: { 
  gyms: any[], 
  waitTime?: string,
  defaultOnboardingFee?: number 
}) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Search & Statistics Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-4">
         <div className="space-y-3">
            <div className="flex items-center space-x-3 text-brand-green">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Governance Hub</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Verification <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Desk</span></h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">Reviewing partner applications for network entry.</p>
         </div>
         <div className="flex items-center bg-white border border-slate-200/60 rounded-2xl px-6 py-4 shadow-sm space-x-8">
            <div className="flex items-center space-x-3 border-r border-slate-100 pr-8">
               <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Live Queue: {gyms.length} Units</span>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
               <Clock size={16} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Speed: {waitTime}</span>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden shadow-sm relative ring-1 ring-slate-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Facility Unit</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Owner Identity</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Onboarding Date</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="p-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-28 text-center bg-white">
                    <div className="flex flex-col items-center space-y-6 opacity-20">
                      <ShieldCheck size={32} strokeWidth={1} className="text-slate-400" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Queue Fully Audited</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym, i) => (
                  <tr key={gym.id} className="hover:bg-slate-50/50 transition-all group border-slate-100">
                    <td className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-[1.2rem] bg-slate-50 border border-slate-100 flex-shrink-0 relative overflow-hidden shadow-sm">
                           {gym.imageUrls && gym.imageUrls[0] ? (
                              <Image src={gym.imageUrls[0]} alt="gym" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" width={100} height={100} unoptimized />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-200">
                                 <Store size={20} />
                              </div>
                           )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-brand-green transition-colors">{gym.name}</p>
                          <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                             <MapPin size={12} className="mr-2 text-brand-green/60" />
                             {gym.location.substring(0, 25)}{gym.location.length > 25 ? "..." : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none">{gym.owner?.name || "Credential Missing"}</p>
                        <p className="text-[10px] font-bold text-slate-600 lowercase tracking-tight">{gym.owner?.email || "No Email"}</p>
                      </div>
                    </td>
                    <td className="p-8">
                       <div className="inline-flex flex-col">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Creation Date</span>
                          <span className="text-xs font-black text-slate-900 uppercase leading-none">{new Date(gym.createdAt).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="p-8">
                       {gym.status === "PENDING" && (
                          <div className="flex items-center space-x-2 text-amber-500 bg-amber-50/50 border border-amber-100/50 px-4 py-2 rounded-xl w-fit italic font-black text-[9px] uppercase tracking-widest">
                             <AlertCircle size={14} />
                             <span>Audit Required</span>
                          </div>
                       )}
                       {gym.status === "APPROVED" && (
                          <div className="flex items-center space-x-2 text-brand-green bg-brand-green/5 border border-brand-green/10 px-4 py-2 rounded-xl w-fit italic font-black text-[9px] uppercase tracking-widest">
                             <CheckCircle2 size={14} />
                             <span>Active & Verified</span>
                          </div>
                       )}
                       {gym.status === "REJECTED" && (
                          <div className="flex items-center space-x-2 text-red-500 bg-red-50/50 border border-red-100/50 px-4 py-2 rounded-xl w-fit italic font-black text-[9px] uppercase tracking-widest">
                             <XCircle size={14} />
                             <span>Reject Protocol</span>
                          </div>
                       )}
                    </td>
                    <td className="p-8 text-right">
                       <Link 
                         href={`/admin/gyms/${gym.id}/verify`}
                         className="inline-flex items-center space-x-3 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-brand-green hover:text-slate-950 hover:scale-[1.02] transition-all active:scale-95 group/btn leading-none"
                       >
                          <span>Review & Audit</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
         <div className="bg-slate-900 rounded-[2rem] p-10 space-y-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/5 blur-[80px] -mr-24 -mt-24" />
            <div className="flex items-center space-x-6 text-brand-green relative z-10">
               <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                  <ShieldCheck size={28} />
               </div>
               <div className="space-y-1">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">Security <br/> Governance</h4>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest underline decoration-slate-800 underline-offset-4">Security Level 4</p>
               </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest relative z-10">
               All facility documentation is encrypted. Approval triggers **Immediate Deployment**. The unit will be LIVE and ready to accept bookings instantly upon Audit completion.
            </p>
         </div>

         <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-10 flex flex-col justify-center space-y-8 shadow-sm group">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Audit Queue Statistics</p>
               <p className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  {gyms.filter(g => g.status === "PENDING").length} <span className="text-slate-200">Pending</span>
               </p>
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
               Maintaining a <span className="text-brand-green">100% Audit Integrity</span> across the PassFit Network. Every hub is manually vetted for enterprise-grade standards.
            </p>
         </div>
      </div>
    </div>
  );
}
