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
import { TicketStatus } from "@prisma/client";
import { updateTicketStatus } from "@/app/actions/support";

export default async function AdminSupportPage() {
  const [tickets, stats] = await Promise.all([
    prisma.supportTicket.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.supportTicket.groupBy({
      by: ["status"],
      _count: true
    })
  ]);

  const openCount = stats.find(s => s.status === TicketStatus.OPEN)?._count || 0;
  const resolvedCount = stats.find(s => s.status === TicketStatus.RESOLVED)?._count || 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">Dispute Command</h1>
          <p className="text-zinc-500 text-sm font-medium">Manage and resolve user disputes and support tickets.</p>
        </div>
        <div className="flex space-x-4">
           <div className="bg-zinc-900 border border-white/5 rounded-2xl px-6 py-3 flex items-center space-x-3">
              <AlertCircle size={18} className="text-orange-500" />
              <div>
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Open Tickets</p>
                 <p className="text-lg font-black text-white">{openCount}</p>
              </div>
           </div>
           <div className="bg-zinc-900 border border-white/5 rounded-2xl px-6 py-3 flex items-center space-x-3">
              <CheckCircle2 size={18} className="text-brand-green" />
              <div>
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Resolved</p>
                 <p className="text-lg font-black text-white">{resolvedCount}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="relative w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
               <input 
                 placeholder="Search Ticket ID or User..."
                 className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold text-white placeholder:text-zinc-800 focus:outline-none"
               />
            </div>
            <div className="flex items-center space-x-2">
               <button className="p-3 bg-zinc-950 border border-white/5 rounded-xl text-zinc-600 hover:text-white transition-colors">
                  <Filter size={16} />
               </button>
            </div>
         </div>

         <div className="divide-y divide-white/5">
            {tickets.length === 0 ? (
               <div className="p-32 text-center space-y-4 opacity-20">
                  <MessageSquare size={64} className="mx-auto" strokeWidth={1} />
                  <p className="text-sm font-black uppercase tracking-widest">All clear. No tickets found.</p>
               </div>
            ) : (
               tickets.map((ticket) => (
                  <div key={ticket.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all group">
                     <div className="flex items-center space-x-8">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5",
                          ticket.status === "OPEN" ? "bg-orange-500/10 text-orange-500" : "bg-brand-green/10 text-brand-green"
                        )}>
                           <MessageSquare size={20} />
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center space-x-3">
                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{ticket.ticketId}</span>
                              <span className={cn(
                                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter",
                                ticket.category === "DISPUTE" ? "bg-red-500/10 text-red-500" : "bg-brand-blue/10 text-brand-blue"
                              )}>
                                 {ticket.category}
                              </span>
                           </div>
                           <h3 className="text-lg font-black text-white uppercase tracking-tight">{ticket.subject}</h3>
                           <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-500 lowercase italic">
                                 <User size={12} />
                                 <span>{ticket.user.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                                 <Clock size={12} />
                                 <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center space-x-6 text-right">
                        <div className="space-y-1">
                           <div className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             ticket.status === "OPEN" ? "text-orange-500" : "text-brand-green"
                           )}>{ticket.status}</div>
                           <div className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">Auto-SLA: 24h</div>
                        </div>
                        <button className="bg-white text-zinc-950 p-4 rounded-xl hover:bg-brand-green transition-all active:scale-90">
                           <ArrowRight size={18} />
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
