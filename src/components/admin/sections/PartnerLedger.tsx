"use client";

import React from "react";
import { 
  BarChart3, DollarSign, Send, 
  AlertTriangle, Receipt, Phone, ArrowUpRight, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sendDuesReminder } from "@/app/actions/admin";

export function PartnerLedger({ gyms }: { gyms: any[] }) {
  
   const atRiskPartners = gyms.filter((g: any) => {
    const gross = (g.bookings || []).reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0);
    const daysLeft = g.commissionFreeUntil ? Math.max(0, Math.ceil((new Date(g.commissionFreeUntil).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 45; 
    return daysLeft === 0 && (gross * ((g.baseCommissionRate || 15) / 100)) > 5000;
  });

  const handleSendReminder = async (gymId: string) => {
    const res = await sendDuesReminder(gymId);
    if (res.success) {
      alert("WhatsApp reminder scheduled locally (Mock)");
    }
  };

  const activeCount = gyms.filter(g => g.status === "APPROVED" && !g.isPaused).length;
  const totalCount = gyms.length || 1;
  const retentionRate = ((activeCount / totalCount) * 100).toFixed(1);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-4">
         <div className="space-y-3">
            <div className="flex items-center space-x-3 text-amber-500">
               <DollarSign size={20} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Financial Custody Active</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Partner <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Ledger</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Tracking commission-free periods and platform dues.</p>
         </div>
         <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-green hover:text-slate-900 transition-all shadow-xl active:scale-95 italic">
            Download Journal
         </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200/40 relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Partner Entity</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Grace Window</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-center">Pending Dues</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Network Value</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-32 text-center bg-white">
                    <div className="flex flex-col items-center space-y-8 opacity-20">
                      <BarChart3 size={72} strokeWidth={1} className="text-slate-400" />
                      <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-500 italic">Financial Data Sync Pending</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym: any) => {
                  const daysLeft = gym.commissionFreeUntil ? Math.max(0, Math.ceil((new Date(gym.commissionFreeUntil).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 45; 
                  const gross = (gym.bookings || []).reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0);
                  const commissionRate = (gym.baseCommissionRate || 15) / 100;
                  const dues = (daysLeft === 0) ? (gross * commissionRate) : 0;
                  
                  return (
                    <tr key={gym.id} className="hover:bg-slate-50/50 transition-all group border-slate-100">
                      <td className="p-10">
                        <div className="flex items-center space-x-6">
                           <div className={cn(
                             "w-3 h-3 rounded-full",
                             daysLeft < 10 ? "bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-brand-green shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                           )} />
                           <div className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-brand-green transition-colors italic">{gym.name}</div>
                        </div>
                      </td>
                      <td className="p-10">
                        <div className="flex items-center space-x-6">
                           <div className={cn(
                              "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase border tracking-widest italic",
                              daysLeft < 15 ? "bg-red-50 text-red-500 border-red-100" : "bg-slate-50 text-slate-400 border-slate-100"
                           )}>
                              {daysLeft} Days
                           </div>
                           <div className="flex-1 max-w-[140px] h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                              <div className={cn("h-full rounded-full transition-all duration-[2000ms]", daysLeft < 15 ? "bg-red-500" : "bg-brand-green")} style={{ width: `${Math.min(100, (daysLeft/30) * 100)}%` }} />
                           </div>
                        </div>
                      </td>
                      <td className="p-10 text-center">
                        <div className={cn(
                           "text-2xl font-black tracking-tighter italic leading-none",
                           dues > 0 ? "text-red-500 underline decoration-red-100 underline-offset-8" : "text-slate-900"
                        )}>
                           ₹{dues.toLocaleString()}
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase mt-3 tracking-widest italic">Pending Commission</p>
                      </td>
                      <td className="p-10">
                         <div className="flex items-center space-x-3 text-brand-green mb-2 px-4 py-2 bg-brand-green/5 border border-brand-green/10 rounded-[1.2rem] w-fit italic">
                            <TrendingUp size={16} />
                            <span className="text-xl font-black tabular-nums">₹{gross.toLocaleString()}</span>
                         </div>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2 italic">Lifetime Gross</p>
                      </td>
                      <td className="p-10 text-right">
                         <div className="flex justify-end items-center space-x-4">
                            <button 
                               onClick={() => handleSendReminder(gym.id)}
                               className="w-12 h-12 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center p-0"
                               title="Send Recovery Reminder"
                            >
                               <Phone size={20} />
                            </button>
                            <button 
                               className="w-12 h-12 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center p-0"
                               title="Journal Deep-Dive"
                            >
                               <Receipt size={20} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
         <div className="bg-slate-900 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/10 blur-[100px] -mr-24 -mt-24" />
            <div className="flex items-center space-x-6 text-brand-green relative z-10">
               <div className="w-16 h-16 rounded-[1.8rem] bg-brand-green/10 flex items-center justify-center border border-brand-green/20 shadow-inner">
                  <AlertTriangle size={32} />
               </div>
               <div className="space-y-1">
                  <h4 className="text-3xl font-black uppercase tracking-tighter text-white italic leading-none">Dues <br/> Recovery</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-slate-800 underline-offset-4">Governance Mode</p>
               </div>
            </div>
            <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic relative z-10">
               {atRiskPartners.length} partners currently exceed the 15-day grace window. Platform protocol suggests immediate reminder deployment for balances above ₹5,000.
            </p>
            <button className="bg-white text-slate-900 px-10 py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-green transition-all shadow-xl active:scale-95 italic relative z-10">
               Run Recovery Workflow <ArrowUpRight size={18} className="inline ml-2" />
            </button>
         </div>

         <div className="bg-slate-50/50 border border-slate-100 rounded-[3.5rem] p-12 flex flex-col justify-center space-y-8 shadow-sm group">
            <div className="space-y-2">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Network Health Index</p>
               <p className="text-7xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{retentionRate}%</p>
            </div>
            <div className="space-y-4">
               <div className="h-3 bg-white rounded-full border border-slate-100 overflow-hidden shadow-inner group-hover:shadow-lg transition-all duration-700">
                  <div className="h-full bg-slate-900 rounded-full transition-all duration-[3000ms]" style={{ width: `${retentionRate}%` }} />
               </div>
               <div className="flex justify-between items-center px-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Retention Threshold: 85%</p>
                  <p className="text-[9px] font-black text-brand-green uppercase tracking-[0.4em] italic">Master Status: Optimal</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
