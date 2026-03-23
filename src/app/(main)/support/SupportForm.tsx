"use client";

import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { createSupportTicket } from "@/app/actions/support";
import { TicketCategory } from "@prisma/client";

export function SupportForm({ userId }: { userId: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<TicketCategory>("DISPUTE");
  const [isPending, setIsPending] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const res = await createSupportTicket({
      userId,
      subject,
      message,
      category
    });

    if (res.success && res.ticketId) {
      setTicketId(res.ticketId);
    } else {
      alert(res.error || "Failed to submit dispute");
    }
    setIsPending(false);
  };

  if (ticketId) {
    return (
      <div className="bg-zinc-900/60 border border-white/5 rounded-[3rem] p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center mx-auto border border-brand-green/20">
          <CheckCircle2 size={40} className="text-brand-green" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Dispute Registered!</h2>
          <p className="text-zinc-500 text-sm font-medium lowercase">Our elite team will investigate your case within 24 hours.</p>
        </div>
        <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5">
           <span className="text-[10px] font-black text-zinc-600 tracking-[0.2em] uppercase">Your Ticket ID</span>
           <div className="text-2xl font-black text-brand-green mt-2 tracking-widest">{ticketId}</div>
        </div>
        <button 
          onClick={() => window.location.href = "/profile"}
          className="bg-white text-zinc-950 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all"
        >
          Track in Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/40 border border-white/5 rounded-[3.5rem] p-10 lg:p-14 space-y-10 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">RAISE A<br/><span className="text-brand-green">DISPUTE</span></h2>
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">PF-SUPPORT UNIT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-4">Category</label>
          <div className="flex space-x-2 bg-zinc-950 p-2 rounded-2xl border border-white/5">
             <button 
               type="button"
               onClick={() => setCategory("DISPUTE")}
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === "DISPUTE" ? "bg-brand-green text-zinc-950 shadow-lg" : "text-zinc-500 hover:text-white"}`}
             >
               Dispute
             </button>
             <button 
               type="button"
               onClick={() => setCategory("TECHNICAL")}
               className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === "TECHNICAL" ? "bg-brand-blue text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}
             >
               Technical
             </button>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-4">Subject</label>
          <input 
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="E.G. WRONG PAYMENT AMOUNT"
            className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-brand-green/30 transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-4">Detailed Message</label>
        <textarea 
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="DESCRIBE YOUR ISSUE IN DETAIL..."
          className="w-full bg-zinc-950 border border-white/5 rounded-[2rem] py-6 px-8 text-xs font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-brand-green/30 transition-all uppercase tracking-widest resize-none"
        />
      </div>

      <div className="flex items-start space-x-4 bg-zinc-950/50 p-6 rounded-3xl border border-white/5 opacity-60">
         <AlertCircle size={16} className="text-zinc-600 shrink-0 mt-0.5" />
         <p className="text-[10px] font-bold text-zinc-600 leading-relaxed uppercase tracking-tight">
            Compliance Note: Disputes are logged into our immutable audit trail. Deliberate false reporting may result in account suspension.
         </p>
      </div>

      <button 
        type="submit"
        disabled={isPending}
        className="w-full bg-brand-green text-zinc-950 py-7 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-4 disabled:opacity-50 disabled:scale-100"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>PROCESSING DISPUTE...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>SUBMIT DISPUTE TICKET</span>
          </>
        )}
      </button>
    </form>
  );
}
