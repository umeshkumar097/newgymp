import React from "react";
import { prisma } from "@/lib/prisma";
import { 
  Zap, User, MapPin, Calendar, Clock, 
  Send, CheckCircle2, AlertCircle, TrendingUp,
  Search, Filter, MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nudgeIntent } from "@/app/actions/admin";
import { revalidatePath } from "next/cache";

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
    recoveryRate: "12%" // Placeholder
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-brand-blue">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Recovery Intelligence</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase font-heading">The Rescue Center</h1>
          <p className="text-slate-500 font-medium text-sm">Convert abandoned sessions into active gym members.</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5">
           <div className="px-4 py-2 bg-slate-800 rounded-xl flex items-center space-x-3 border border-white/5">
              <AlertCircle size={16} className="text-orange-500" />
              <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Intents</p>
                 <p className="text-sm font-black text-white">{stats.pending}</p>
              </div>
           </div>
           <div className="px-4 py-2 bg-slate-800 rounded-xl flex items-center space-x-3 border border-white/5">
              <TrendingUp size={16} className="text-brand-green" />
              <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. Recovery</p>
                 <p className="text-sm font-black text-white">₹{stats.pending * 499}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Intents Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-outfit">Live Intent Stream</h3>
            <div className="flex items-center space-x-2">
               <button className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><Filter size={14} /></button>
               <button className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-500 hover:text-white transition-all"><Search size={14} /></button>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm self-start">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hub Detail</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Lapsed</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {intents.length > 0 ? intents.map((intent: any) => (
                  <tr key={intent.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/5 text-slate-400">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white tracking-tight uppercase">{intent.user?.name || "Anonymous"}</p>
                          <p className="text-[10px] font-bold text-slate-500 tracking-wider lowercase">{intent.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin size={12} className="text-brand-green" />
                          <p className="text-xs font-bold text-slate-300 uppercase truncate max-w-[150px]">{intent.gym?.name}</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Plan: {intent.planId.replace(/_/g, " ")}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-tighter">
                          {Math.floor((new Date().getTime() - new Date(intent.createdAt).getTime()) / 60000)} mins ago
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <form action={async () => {
                         "use server";
                         await nudgeIntent(intent.id);
                      }}>
                        <button className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-blue text-[#0F172A] rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-blue/20">
                           <Send size={12} />
                           <span>Nudge</span>
                        </button>
                      </form>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="inline-flex flex-col items-center space-y-4">
                         <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center border border-white/5 text-slate-700">
                            <CheckCircle2 size={32} />
                         </div>
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Zero Abandoned Sessions Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-brand-blue to-brand-green p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-all duration-1000" />
              <div className="relative space-y-6">
                 <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    <TrendingUp size={24} />
                 </div>
                 <h4 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter leading-none">Automated<br/>Recovery Daemon</h4>
                 <p className="text-[10px] font-bold text-[#0F172A]/70 uppercase tracking-widest leading-relaxed">System monitoring enabled. High probability of conversion detected for 3 sessions.</p>
                 <button className="w-full bg-[#0F172A] text-white font-black py-4 rounded-xl text-[9px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-950 transition-all">Enable Auto-Pilot</button>
              </div>
           </div>

           <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Top Recovery Hubs</h4>
              <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 group hover:border-brand-green/30 transition-all cursor-pointer">
                       <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-brand-green transition-all">
                             <ArrowUpRight size={14} />
                          </div>
                          <span className="text-[10px] font-black text-white uppercase tracking-tight">Elite Fitness Hub</span>
                       </div>
                       <span className="text-[10px] font-black text-brand-green">92%</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
