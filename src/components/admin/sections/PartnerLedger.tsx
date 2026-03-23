"use client";

import React from "react";
import { 
  BarChart3, Clock, DollarSign, Send, 
  AlertTriangle, Receipt, Phone, ArrowUpRight, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sendDuesReminder } from "@/app/actions/admin";

export function PartnerLedger({ gyms }: { gyms: any[] }) {
  
  const handleSendReminder = async (gymId: string) => {
    const res = await sendDuesReminder(gymId);
    if (res.success) {
      alert("WhatsApp reminder scheduled locally (Mock)");
    }
  };

  const getDaysLeft = (date: Date) => {
    const now = new Date();
    const expiry = new Date(date);
    const diff = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-8">
         <div className="space-y-1">
            <h2 className="text-2xl font-extrabold font-heading text-white uppercase tracking-tighter">Partner Ledger</h2>
            <p className="text-sm font-medium text-slate-500">Financial tracking for commission-free periods and Pay-at-Gym dues.</p>
         </div>
         <button className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-[#0F172A] transition-all">
            Download Financial Report
         </button>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/50 border-b border-white/5">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Partner Gym</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Grace Period Left</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Pending Commission</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Net Value</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gyms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center opacity-20">
                    <BarChart3 size={48} className="mx-auto mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">No financial data available</p>
                  </td>
                </tr>
              ) : (
                gyms.map((gym: any) => {
                  const daysLeft = gym.commissionFreeUntil ? getDaysLeft(new gym.commissionFreeUntil()) : 45; // Mocking 45 if missing
                  const dues = 3500; // Mocking dues
                  
                  return (
                    <tr key={gym.id} className="hover:bg-slate-800/30 transition-all">
                      <td className="p-8">
                        <div className="flex items-center space-x-3">
                           <div className="w-2 h-2 rounded-full bg-brand-green" />
                           <div className="text-sm font-extrabold text-white uppercase tracking-tight">{gym.name}</div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center space-x-4">
                           <div className={cn(
                              "px-3 py-1.5 rounded-xl font-black text-[10px] uppercase border",
                              daysLeft < 15 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-slate-800 text-slate-400 border-white/5"
                           )}>
                              {daysLeft} Days Left
                           </div>
                           <div className="flex-1 max-w-[100px] h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-green" style={{ width: `${(daysLeft/90) * 100}%` }} />
                           </div>
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        <div className={cn(
                           "text-xl font-black font-heading tracking-tight",
                           dues > 0 ? "text-red-500" : "text-brand-green"
                        )}>
                           ₹{dues.toLocaleString()}
                        </div>
                        <p className="text-[9px] font-bold text-slate-600 uppercase mt-1 tracking-widest">Unpaid Commissions</p>
                      </td>
                      <td className="p-8">
                         <div className="flex items-center space-x-2 text-brand-green mb-1">
                            <TrendingUp size={14} />
                            <span className="text-lg font-black font-heading">₹42.2k</span>
                         </div>
                         <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Lifetime Generated</p>
                      </td>
                      <td className="p-8 text-right">
                         <div className="flex justify-end items-center space-x-4">
                            <button 
                               onClick={() => handleSendReminder(gym.id)}
                               className="p-3 bg-slate-800 rounded-xl text-brand-green hover:bg-brand-green hover:text-[#0F172A] transition-all shadow-xl active:scale-95"
                               title="Send WhatsApp Reminder"
                            >
                               <Phone size={18} />
                            </button>
                            <button 
                               className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-xl active:scale-95"
                               title="View Detailed Ledger"
                            >
                               <Receipt size={18} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
            <div className="flex items-center space-x-4 text-orange-500">
               <AlertTriangle size={24} />
               <h4 className="text-lg font-extrabold uppercase tracking-tighter text-white">Critical Recovery</h4>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
               There are 12 partners with commissions older than 15 days. System suggests enabling "Kill Switch" for partners with dues exceeding ₹5,000.
            </p>
            <button className="text-xs font-black text-brand-blue uppercase hover:underline flex items-center tracking-widest">
               Show at-risk partners <ArrowUpRight size={14} className="ml-2" />
            </button>
         </div>

         <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-center space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Platform Retention Rate</p>
            <p className="text-4xl font-extrabold font-heading text-white uppercase tracking-tighter">98.2%</p>
            <div className="h-1 bg-white/5 rounded-full mt-4">
               <div className="h-full bg-brand-green w-[98.2%]" />
            </div>
         </div>
      </div>
    </div>
  );
}
