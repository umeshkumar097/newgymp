"use client";

import React from "react";
import { 
  BarChart3, Clock, DollarSign, Send, 
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
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-10 px-4">
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Partner Ledger</h2>
            <p className="text-sm font-medium text-slate-400">Financial tracking for commission-free periods and platform dues.</p>
         </div>
         <button className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-green hover:text-zinc-950 transition-all shadow-3xl">
            Download Journal
         </button>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-3xl">
        {/* ... table remains same ... */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-950/50 border-b border-white/10">
              <tr>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Partner Gym</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Grace Period Left</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Pending Dues</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Net Contribution</th>
                <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-28 text-center bg-zinc-950/20">
                    <div className="flex flex-col items-center space-y-8 opacity-20">
                      <BarChart3 size={72} strokeWidth={1} />
                      <p className="text-sm font-black uppercase tracking-[0.4em]">Financial data sync pending</p>
                    </div>
                  </td>
                </tr>
              ) : (
                gyms.map((gym: any) => {
                  const daysLeft = gym.commissionFreeUntil ? Math.max(0, Math.ceil((new Date(gym.commissionFreeUntil).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 45; 
                  
                  // Calculate dynamic gross and dues
                  const gross = (gym.bookings || []).reduce((acc: number, b: any) => acc + (b.totalAmount || 0), 0);
                  const commissionRate = (gym.baseCommissionRate || 15) / 100;
                  const dues = (daysLeft === 0) ? (gross * commissionRate) : 0;
                  
                  return (
                    <tr key={gym.id} className="hover:bg-zinc-900 transition-all group border-white/5">
                      <td className="p-10">
                        <div className="flex items-center space-x-4">
                           <div className="w-2.5 h-2.5 rounded-full bg-brand-green shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                           <div className="text-lg font-black text-white uppercase tracking-tight group-hover:text-brand-green transition-colors">{gym.name}</div>
                        </div>
                      </td>
                      <td className="p-10">
                        <div className="flex items-center space-x-6">
                           <div className={cn(
                              "px-4 py-2 rounded-xl font-black text-[10px] uppercase border tracking-widest",
                              daysLeft < 15 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-zinc-950 text-slate-400 border-white/5"
                           )}>
                              {daysLeft} Days Left
                           </div>
                           <div className="flex-1 max-w-[120px] h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                              <div className={cn("h-full rounded-full transition-all duration-1000", daysLeft < 15 ? "bg-red-500" : "bg-brand-green")} style={{ width: `${(daysLeft/90) * 100}%` }} />
                           </div>
                        </div>
                      </td>
                      <td className="p-10 text-center">
                        <div className={cn(
                           "text-2xl font-black tracking-tight italic",
                           dues > 0 ? "text-red-500" : "text-brand-green"
                        )}>
                           ₹{dues.toLocaleString()}
                        </div>
                        <p className="text-[10px] font-black text-slate-600 uppercase mt-1.5 tracking-widest">Commission Dues</p>
                      </td>
                      <td className="p-10">
                         <div className="flex items-center space-x-3 text-brand-green mb-1.5 px-3 py-1 bg-brand-green/5 border border-brand-green/10 rounded-xl w-fit">
                            <TrendingUp size={16} />
                            <span className="text-xl font-black">₹{gross.toLocaleString()}</span>
                         </div>
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Lifetime Gross</p>
                      </td>
                      <td className="p-10 text-right">
                         <div className="flex justify-end items-center space-x-4">
                            <button 
                               onClick={() => handleSendReminder(gym.id)}
                               className="p-4 bg-zinc-950 border border-white/5 rounded-2xl text-brand-green hover:bg-brand-green hover:text-zinc-950 transition-all shadow-xl active:scale-95"
                               title="Send WhatsApp Reminder"
                            >
                               <Phone size={20} />
                            </button>
                            <button 
                               className="p-4 bg-zinc-950 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-zinc-800 transition-all shadow-xl active:scale-95"
                               title="View Detailed Ledger"
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
         <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-3xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full" />
            <div className="flex items-center space-x-5 text-orange-500 relative z-10">
               <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <AlertTriangle size={28} />
               </div>
               <h4 className="text-2xl font-black uppercase tracking-tighter text-white italic leading-none">Critical <br/> Recovery</h4>
            </div>
            <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-tight relative z-10">
               There are {atRiskPartners.length} partners with commissions older than 15 days. System suggests enabling "Kill Switch" for partners with dues exceeding ₹5,000.
            </p>
            <button className="text-[11px] font-black text-brand-blue uppercase hover:underline flex items-center tracking-[0.2em] relative z-10 group/link">
               IDENTIFY AT-RISK PARTNERS <ArrowUpRight size={16} className="ml-2 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
            </button>
         </div>

         <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-center space-y-4 shadow-3xl hover:border-brand-green/20 transition-all">
            <div className="space-y-1">
               <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform Retention Rate</p>
               <p className="text-6xl font-black text-white uppercase tracking-tighter italic">{retentionRate}%</p>
            </div>
            <div className="space-y-3">
               <div className="h-2.5 bg-zinc-950 rounded-full border border-white/5 overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-brand-blue to-brand-green rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${retentionRate}%` }} />
               </div>
               <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">SYNCED NOW • STABLE NETWORK</p>
            </div>
         </div>
      </div>
    </div>
  );
}
