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

const PF_STATUS = {
  OPEN: "OPEN" as any,
  RESOLVED: "RESOLVED" as any
};

export default async function AdminSupportPage() {
  const [tickets, stats] = await Promise.all([
    (prisma as any).supportTicket?.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" }
    }) || Promise.resolve([]),
    (prisma as any).supportTicket?.groupBy({
      by: ["status"],
      _count: true
    }) || Promise.resolve([])
  ]);

  const openCount = (stats as any[]).find((s: any) => s.status === PF_STATUS.OPEN)?._count || 0;
  const resolvedCount = (stats as any[]).find((s: any) => s.status === PF_STATUS.RESOLVED)?._count || 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Support Tickets</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and resolve user disputes and platform inquiries.</p>
        </div>
        <div className="flex space-x-6">
           <div className="bg-white border border-slate-200/60 rounded-[2rem] px-8 py-5 flex items-center space-x-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                 <AlertCircle size={22} className="text-orange-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tickets</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{openCount}</p>
              </div>
           </div>
           <div className="bg-white border border-slate-200/60 rounded-[2rem] px-8 py-5 flex items-center space-x-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                 <CheckCircle2 size={22} className="text-brand-green" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved</p>
                 <p className="text-2xl font-black text-slate-900 tracking-tight">{resolvedCount}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-sm">
         <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-96 group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={18} />
               <input 
                 placeholder="Search identifiers or users..."
                 className="w-full bg-white border border-slate-200/60 rounded-2xl py-4 pl-14 pr-6 text-sm font-black text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-brand-blue/30 transition-all uppercase tracking-widest shadow-sm"
               />
            </div>
            <div className="flex items-center space-x-4">
               <button className="p-4 bg-white border border-slate-200/60 rounded-2xl text-slate-300 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                  <Filter size={18} />
               </button>
            </div>
         </div>

         <div className="divide-y divide-slate-50">
            {tickets.length === 0 ? (
               <div className="p-40 text-center space-y-6 opacity-20 text-slate-300">
                  <MessageSquare size={64} className="mx-auto stroke-1" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Queue Cleared • No Tickets detected</p>
               </div>
            ) : (
               (tickets as any[]).map((ticket: any) => (
                  <div key={ticket.id} className="p-10 flex items-center justify-between hover:bg-slate-50/30 transition-all group relative overflow-hidden">
                     <div className="flex items-center space-x-10">
                        <div className={cn(
                          "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 duration-500",
                          ticket.status === "OPEN" ? "bg-orange-50 text-orange-500 border-orange-100" : "bg-green-50 text-brand-green border-green-100"
                        )}>
                           <MessageSquare size={26} />
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center space-x-4">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">HUB-TICKET: {ticket.ticketId.toUpperCase()}</span>
                              <span className={cn(
                                "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                ticket.category === "DISPUTE" ? "bg-red-50 text-red-500 border-red-100" : "bg-blue-50 text-brand-blue border-blue-100"
                              )}>
                                 {ticket.category}
                              </span>
                           </div>
                           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-brand-blue transition-colors leading-none">{ticket.subject}</h3>
                           <div className="flex items-center space-x-8 pt-1">
                              <div className="flex items-center space-x-3 text-sm font-semibold text-slate-500 tracking-tight">
                                 <User size={14} className="text-brand-blue" />
                                 <span>{ticket.user.email}</span>
                              </div>
                              <div className="flex items-center space-x-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                 <Clock size={14} className="text-slate-200" />
                                 <span>{new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center space-x-10 text-right">
                        <div className="space-y-2">
                           <div className={cn(
                             "text-[10px] font-black uppercase tracking-[0.3em]",
                             ticket.status === "OPEN" ? "text-orange-500" : "text-brand-green"
                           )}>{ticket.status}</div>
                           <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">SLA: 24H</div>
                        </div>
                        <button className="bg-slate-900 text-white p-5 rounded-2xl hover:bg-brand-green hover:text-slate-950 transition-all shadow-lg active:scale-95 group/btn border border-slate-800">
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
