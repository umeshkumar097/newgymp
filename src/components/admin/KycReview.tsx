"use client";

import React, { useState } from "react";
import { FileText, Eye, ExternalLink, ShieldCheck, X, CreditCard, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface KycReviewProps {
  gym: {
    panNumber: string | null;
    panPhotoUrl: string | null;
    bankAccountNumber: string | null;
    bankIfscCode: string | null;
    bankProofUrl: string | null;
    registrationDocUrl: string | null;
    name: string;
  };
}

export function KycReview({ gym }: KycReviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all border border-zinc-700/50 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest"
      >
        <FileText size={14} />
        <span>Docs</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-zinc-950/60 transition-all animate-in fade-in duration-300">
           <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] p-10 shadow-3xl flex flex-col space-y-8 animate-in zoom-in duration-300 overflow-hidden">
              
              <div className="flex justify-between items-center bg-zinc-950 -m-10 p-10 mb-0">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase tracking-tight text-white">{gym.name} • KYC Review</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Verification of legal documents</p>
                    </div>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-10 pt-10">
                 {/* PAN Section */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                       <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center">
                          <FileText size={16} className="mr-2 text-brand-green" />
                          PAN Card Details
                       </h4>
                       <div className="p-6 bg-zinc-950 rounded-2xl border border-white/5 space-y-1">
                          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">PAN Number</p>
                          <p className="text-2xl font-black text-brand-green tracking-tighter uppercase">{gym.panNumber || "NOT PROVIDED"}</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Photo Proof</p>
                          {gym.panPhotoUrl && <a href={gym.panPhotoUrl} target="_blank" className="text-brand-blue flex items-center text-[10px] font-black uppercase hover:underline"><ExternalLink size={12} className="mr-1" /> View Full</a>}
                       </div>
                       <div className="aspect-video bg-black rounded-2xl border border-white/5 overflow-hidden relative group">
                          {gym.panPhotoUrl ? (
                            <img src={gym.panPhotoUrl} className="w-full h-full object-contain" alt="pan" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black uppercase tracking-widest text-xs">No Image Found</div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Registration Section */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                       <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center">
                          <Building size={16} className="mr-2 text-brand-blue" />
                          Business Registration
                       </h4>
                       <div className="p-6 bg-zinc-950 rounded-2xl border border-white/5 space-y-2">
                          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Document Type</p>
                          <p className="text-xs font-black text-white tracking-widest uppercase">GST / UDYAM / TRADE CERTIFICATE</p>
                          <div className="mt-4 px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20 w-fit">
                             <p className="text-[8px] font-black text-brand-blue uppercase">Official Proof of Name</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Registration Proof</p>
                          {gym.registrationDocUrl && <a href={gym.registrationDocUrl} target="_blank" className="text-brand-blue flex items-center text-[10px] font-black uppercase hover:underline"><ExternalLink size={12} className="mr-1" /> View Full</a>}
                       </div>
                       <div className="aspect-video bg-black rounded-2xl border border-white/5 overflow-hidden relative group">
                          {gym.registrationDocUrl ? (
                            <img src={gym.registrationDocUrl} className="w-full h-full object-contain" alt="registration" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black uppercase tracking-widest text-xs font-outfit">No Document Found</div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Bank Section */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center">
                          <CreditCard size={16} className="mr-2 text-brand-blue" />
                          Payout Bank Details
                       </h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-zinc-950 rounded-2xl border border-white/5 space-y-1">
                             <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Account Num</p>
                             <p className="text-sm font-black text-white truncate">{gym.bankAccountNumber || "N/A"}</p>
                          </div>
                          <div className="p-6 bg-zinc-950 rounded-2xl border border-white/5 space-y-1">
                             <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">IFSC Code</p>
                             <p className="text-sm font-black text-white">{gym.bankIfscCode || "N/A"}</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Bank Proof (Cheque)</p>
                          {gym.bankProofUrl && <a href={gym.bankProofUrl} target="_blank" className="text-brand-blue flex items-center text-[10px] font-black uppercase hover:underline"><ExternalLink size={12} className="mr-1" /> View Full</a>}
                       </div>
                       <div className="aspect-video bg-black rounded-2xl border border-white/5 overflow-hidden">
                          {gym.bankProofUrl ? (
                            <img src={gym.bankProofUrl} className="w-full h-full object-contain" alt="bank proof" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-800 font-black uppercase tracking-widest text-xs">No Image Found</div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-center space-x-4">
                 <ShieldCheck size={20} className="text-brand-green" />
                 <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight italic">
                    Verify that the PAN Name, Bank Owner, and Gym Owner identity match before proceeding with approval.
                 </p>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
