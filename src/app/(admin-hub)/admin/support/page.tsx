import React from "react";
import { prisma } from "@/lib/prisma";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Filter,
  User,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { TicketStatus } from "@prisma/client";
// Use type assertion strings if prisma generate is lagging
const PF_STATUS = {
  OPEN: "OPEN" as any,
  RESOLVED: "RESOLVED" as any
};
import { updateTicketStatus } from "@/app/actions/support";

export default async function AdminSupportPage() {
  const [tickets, stats] = await Promise.all([
    (prisma as any).supportTicket.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" }
    }),
    (prisma as any).supportTicket.groupBy({
      by: ["status"],
      _count: true
    })
  ]);

  const openCount = (stats as any[]).find((s: any) => s.status === PF_STATUS.OPEN)?._count || 0;
  const resolvedCount = (stats as any[]).find((s: any) => s.status === PF_STATUS.RESOLVED)?._count || 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#0B0F19] -m-8 p-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Dispute Command</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.1em]">Manage and resolve user disputes and support tickets.</p>
        </div>
        <div className="flex space-x-6">
           <div className="bg-zinc-900 border border-white/10 rounded-[1.5rem] px-8 py-5 flex items-center space-x-5 shadow-3xl">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                 <AlertCircle size={22} className="text-orange-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Open Tickets</p>
                 <p className="text-2xl font-black text-white tracking-tight">{openCount}</p>
              </div>
           </div>
           <div className="bg-zinc-900 border border-white/10 rounded-[1.5rem] px-8 py-5 flex items-center space-x-5 shadow-3xl">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                 <CheckCircle2 size={22} className="text-brand-green" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resolved</p>
                 <p className="text-2xl font-black text-white tracking-tight">{resolvedCount}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-zinc-900 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-4xl">
         <div className="p-10 border-b border-white/10 bg-zinc-950/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-96 group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-blue transition-colors" size={18} />
               <input 
                 placeholder="Search identifiers or users..."
                 className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-black text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-blue/30 transition-all uppercase tracking-widest shadow-inner"
               />
            </div>
            <div className="flex items-center space-x-4">
               <button className="p-4 bg-zinc-950 border border-white/5 rounded-2xl text-slate-600 hover:text-white hover:border-white/10 transition-all shadow-xl">
                  <Filter size={18} />
               </button>
            </div>
         </div>

         <div className="divide-y divide-white/5 bg-zinc-950/10">
            {tickets.length === 0 ? (
               <div className="p-40 text-center space-y-8 opacity-20">
                  <MessageSquare size={80} className="mx-auto stroke-1" />
                  <p className="text-sm font-black uppercase tracking-[0.4em]">Protocol Clear • No Tickets Detected</p>
               </div>
            ) : (
               (tickets as any[]).map((ticket: any) => (
                  <div key={ticket.id} className="p-10 flex items-center justify-between hover:bg-zinc-900 transition-all group border-white/5 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue/0 group-hover:bg-brand-blue transition-all" />
                     <div className="flex items-center space-x-10">
                        <div className={cn(
                          "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border shadow-2xl transition-transform group-hover:scale-105 duration-500",
                          ticket.status === "OPEN" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-brand-green/10 text-brand-green border-brand-green/20"
                        )}>
                           <MessageSquare size={26} />
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center space-x-4">
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">HUB-TICKET: {ticket.ticketId.toUpperCase()}</span>
                              <span className={cn(
                                "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-inner",
                                ticket.category === "DISPUTE" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                              )}>
                                 {ticket.category}
                              </span>
                           </div>
                           <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand-blue transition-colors leading-none">{ticket.subject}</h3>
                           <div className="flex items-center space-x-8 pt-1">
                              <div className="flex items-center space-x-3 text-sm font-medium text-slate-400 lowercase italic">
                                 <User size={14} className="text-brand-blue" />
                                 <span>{ticket.user.email}</span>
                              </div>
                              <div className="flex items-center space-x-3 text-[11px] font-black text-slate-600 uppercase tracking-widest">
                                 <Clock size={14} className="text-slate-700" />
                                 <span>{new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center space-x-10 text-right">
                        <div className="space-y-2">
                           <div className={cn(
                             "text-[11px] font-black uppercase tracking-[0.3em] italic",
                             ticket.status === "OPEN" ? "text-orange-500" : "text-brand-green"
                           )}>{ticket.status}</div>
                           <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-white/5 text-[9px] font-black text-slate-600 uppercase tracking-widest">Auto-SLA: 24h</div>
                        </div>
                        <button className="bg-white text-zinc-950 p-5 rounded-2xl hover:bg-brand-green transition-all shadow-3xl active:scale-95 group/btn">
                           <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
}
