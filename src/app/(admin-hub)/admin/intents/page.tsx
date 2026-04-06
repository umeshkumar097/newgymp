import React from "react";
import { prisma } from "@/lib/prisma";
import { 
  Zap, User, MapPin, Calendar, Clock, 
  Send, CheckCircle2, AlertCircle, TrendingUp,
  Search, Filter, MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nudgeIntent } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AbandonedBookingsPage() {
  const intents = await (prisma as any).bookingIntent.findMany({
    where: {
      status: { in: ["PENDING", "ABANDONED"] }
    },
    include: {
      user: true,
      gym: true
    },
    orderBy: { createdAt: "desc" }
  });

  const stats = {
    pending: intents.filter((i: any) => i.status === "PENDING").length,
    abandoned: intents.filter((i: any) => i.status === "ABANDONED").length,
    recoveryRate: "12%"
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Rescue Center</h1>
          <p className="text-slate-500 text-sm font-medium">Recover abandoned sessions and convert them into members.</p>
        </div>

        <div className="flex items-center space-x-4 bg-white border border-slate-200/60 rounded-[2rem] px-8 py-5 shadow-sm">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                 <AlertCircle size={18} className="text-orange-500" />
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Intents</p>
                 <p className="text-xl font-black text-slate-900 tracking-tight">{stats.pending}</p>
              </div>
           </div>
           <div className="w-[1px] h-10 bg-slate-100 mx-2" />
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
                 <TrendingUp size={18} className="text-brand-green" />
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Revenue</p>
                 <p className="text-xl font-black text-slate-900 tracking-tight">₹{stats.pending * 499}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 px-4">
        
        {/* Intents Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Stream</h3>
              <div className="flex items-center space-x-4">
                 <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-slate-950 transition-all"><Filter size={14} /></button>
                 <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-slate-950 transition-all"><Search size={14} /></button>
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/10">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hub Target</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50">
                {intents.length > 0 ? intents.map((intent: any) => (
                  <tr key={intent.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 text-white shadow-lg">
                          {intent.user?.name?.[0] || <User size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{intent.user?.name || "Member"}</p>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-extrabold tracking-widest mt-0.5">
                             <Clock size={12} className="text-slate-200" />
                             <span>{Math.floor((new Date().getTime() - new Date(intent.createdAt).getTime()) / 60000)}m ago</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin size={12} className="text-brand-green" />
                          <p className="text-xs font-black text-slate-900 uppercase truncate max-w-[150px]">{intent.gym?.name}</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em]">PLAN: {intent.planId.split('_').pop().toUpperCase()}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-slate-950 transition-all shadow-md active:scale-95 border border-slate-800"
                       >
                          <Send size={12} />
                          <span>Nudge Member</span>
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-24 text-center">
                       <div className="space-y-4 opacity-20 text-slate-300">
                          <CheckCircle2 size={48} className="mx-auto" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Queue Cleared • No abandoned intent</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-10">
           <div className="bg-slate-900 p-10 rounded-[3rem] shadow-xl relative overflow-hidden group border border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative space-y-6">
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-green border border-white/5">
                    <TrendingUp size={24} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter leading-tight">Recovery <br/> Intelligence</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active monitoring Enabled</p>
                 </div>
                 <p className="text-xs font-medium text-slate-400 leading-relaxed">System has detected a 14% higher conversion probability for recent abandoned sessions.</p>
                 <button className="w-full bg-brand-green text-slate-950 font-black py-4 rounded-xl text-[9px] uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-all">Enable Auto-Rescue</button>
              </div>
           </div>

           <div className="bg-white border border-slate-200/60 rounded-[3rem] p-10 space-y-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">High Performance Traits</h4>
              <div className="space-y-4">
                 {[
                   { name: "Fast Response", rate: "92%" },
                   { name: "Nudge Success", rate: "18%" },
                   { name: "Direct Outreach", rate: "24%" }
                 ].map((trait, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group transition-all">
                       <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-brand-green transition-all shadow-sm">
                             <ArrowUpRight size={14} />
                          </div>
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{trait.name}</span>
                       </div>
                       <span className="text-[10px] font-black text-brand-green">{trait.rate}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
