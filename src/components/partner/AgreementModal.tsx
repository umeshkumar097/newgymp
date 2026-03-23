"use client";

import React from "react";
import { X, FileText, Download, ShieldCheck, Printer } from "lucide-react";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    gymName: string;
    address: string;
    date: string;
  };
}

export function AgreementModal({ isOpen, onClose, data }: AgreementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl bg-zinc-950/80 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-white/5 w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-3xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                 <FileText size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-tight text-white">Vendor Tie-up Agreement</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Memorandum of Understanding (MoU)</p>
              </div>
           </div>
           <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.print()}
                className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all"
              >
                <Printer size={20} />
              </button>
              <button 
                onClick={onClose}
                className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 font-serif leading-relaxed text-zinc-300 selection:bg-brand-green/30">
           <div className="text-center space-y-2 mb-10">
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter font-outfit">MEMORANDUM OF UNDERSTANDING (MoU)</h1>
              <p className="text-sm italic font-outfit text-zinc-500 underline underline-offset-8 decoration-zinc-800">VENDOR TIE-UP AGREEMENT</p>
           </div>

           <p className="text-sm">
             This Memorandum of Understanding ("Agreement") is made and entered into on this <span className="border-b-2 border-brand-green px-4 text-white font-black">{data.date.split("-")[2] || "__"}</span> day of <span className="border-b-2 border-brand-green px-8 text-white font-black">{new Date(data.date).toLocaleString('default', { month: 'long' }) || "__________"}</span>, {new Date(data.date).getFullYear() || "202_"} ("Effective Date").
           </p>

           <section className="space-y-4">
              <h3 className="text-white font-black uppercase tracking-widest text-xs font-outfit">BY AND BETWEEN:</h3>
              <p className="text-sm">
                <strong className="text-white">Aiclex Technologies</strong>, a company operating the digital fitness marketplace brand "PassFit" (passfit.in), hereinafter referred to as the <strong className="text-white">"Platform"</strong> or <strong className="text-white">"First Party"</strong>.
              </p>
              <p className="text-sm italic text-zinc-500">AND</p>
              <p className="text-sm">
                <strong className="text-white leading-relaxed border-b-2 border-brand-green/30">{data.gymName || "[Name of the Gym]"}</strong>, located at <strong className="text-white leading-relaxed border-b-2 border-brand-green/30">{data.address || "[Exact Location]"}</strong>, hereinafter referred to as the <strong className="text-white">"Gym Partner"</strong> or <strong className="text-white">"Second Party"</strong>.
              </p>
           </section>

           <div className="space-y-10 py-10">
              <div className="space-y-3">
                 <h4 className="text-brand-green font-black uppercase text-xs tracking-widest font-outfit">1. PURPOSE OF AGREEMENT</h4>
                 <p className="text-sm">The Platform (PassFit) operates an online marketplace that allows users to discover fitness centers and book short-term access (Day Passes) and long-term memberships. The Gym Partner wishes to list its fitness center on the Platform to generate bookings and footfall.</p>
              </div>

              <div className="space-y-3">
                 <h4 className="text-brand-green font-black uppercase text-xs tracking-widest font-outfit">2. OBLIGATIONS OF THE PLATFORM (PASSFIT)</h4>
                 <ul className="list-disc list-inside text-sm space-y-2 pl-4 marker:text-brand-green">
                    <li>The Platform shall list the Gym Partner’s details, photos, amenities, and pricing on the PassFit website/app.</li>
                    <li>The Platform shall facilitate online bookings and collect payments from the customers via a secure Payment Gateway.</li>
                    <li>The Platform shall instantly issue a digital Entry PIN/OTP to the customer upon successful payment.</li>
                    <li>The Platform shall provide a Partner Dashboard to the Gym Partner to verify OTPs and track active bookings and revenue.</li>
                 </ul>
              </div>

              <div className="space-y-3">
                 <h4 className="text-brand-green font-black uppercase text-xs tracking-widest font-outfit">3. OBLIGATIONS OF THE GYM PARTNER</h4>
                 <ul className="list-disc list-inside text-sm space-y-2 pl-4 marker:text-brand-green">
                    <li>The Gym Partner agrees to honor all bookings made through PassFit and allow entry to customers upon successful verification of the PassFit Entry OTP.</li>
                    <li>The Gym Partner shall ensure that the facilities, equipment, and environment are safe, hygienic, and exactly as displayed on the Platform.</li>
                    <li>The Gym Partner shall not charge any additional entry fee to the customer for the services already paid for via PassFit.</li>
                 </ul>
              </div>

              <div className="space-y-3">
                 <h4 className="text-brand-green font-black uppercase text-xs tracking-widest font-outfit">4. COMMERCIAL TERMS & PAYOUTS</h4>
                 <ul className="list-disc list-inside text-sm space-y-2 pl-4 marker:text-brand-green">
                    <li><strong className="text-white">Commission</strong>: The Platform shall deduct a convenience/marketing fee of [15%] (excluding applicable GST) on the total transaction value of every successful booking.</li>
                    <li><strong className="text-white">Settlement</strong>: The remaining payout due to the Gym Partner shall be transferred to the registered bank account on a Weekly / T+2 Days settlement cycle.</li>
                    <li><strong className="text-white">Pricing</strong>: The Gym Partner has the right to update the price of their Day Pass and Memberships through the Partner Dashboard.</li>
                 </ul>
              </div>

              <div className="space-y-3">
                 <h4 className="text-brand-green font-black uppercase text-xs tracking-widest font-outfit">5. CANCELLATION & REFUND POLICY</h4>
                 <ul className="list-disc list-inside text-sm space-y-2 pl-4 marker:text-brand-green">
                    <li>A booking is considered consumed once the customer's Entry OTP is verified at the reception.</li>
                    <li>No refunds shall be provided after the OTP has been verified or if the customer fails to show up (No-show).</li>
                    <li>In case of a dispute, the Platform reserves the right to refund the customer and deduct the respective amount from the upcoming payouts.</li>
                 </ul>
              </div>

              <div className="space-y-3">
                 <h4 className="text-brand-green font-black uppercase text-xs tracking-widest font-outfit">6. TERM & TERMINATION</h4>
                 <p className="text-sm">This Agreement is valid from the Effective Date until terminated by either party. Either party may terminate this agreement by providing a 15-day prior written notice via email.</p>
              </div>
           </div>

           {/* Signatures placeholder */}
           <div className="border-t border-zinc-800 pt-10 grid grid-cols-2 gap-20 pb-20">
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">For Aiclex Technologies (PassFit)</p>
                 <div className="h-[1px] bg-zinc-800 w-full mt-10" />
                 <p className="text-xs font-bold text-white uppercase italic">Umesh Kumar (CEO)</p>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">For Gym Partner</p>
                 <div className="h-[1px] bg-zinc-800 w-full mt-10" />
                 <p className="text-xs font-bold text-white uppercase italic">Digitally Signed by {data.gymName || "Partner"} on {data.date}</p>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-zinc-900/50 flex justify-center">
           <button 
            onClick={onClose}
            className="px-10 py-4 bg-brand-green text-zinc-950 font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-green/20 active:scale-95 transition-all"
           >
             I have read the agreement
           </button>
        </div>
      </div>
    </div>
  );
}
