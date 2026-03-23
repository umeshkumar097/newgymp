import React from "react";

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using PassFit, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all users, including gym members and gym owners."
    },
    {
      title: "2. Platform Role",
      content: "PassFit is a marketplace that connects users with gyms. We are not a fitness provider ourselves. We facilitate the discovery, booking, and payment process for gym passes and memberships."
    },
    {
      title: "3. User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to provide accurate information and to follow the specific rules of the gyms you book through PassFit."
    },
    {
      title: "4. Payments & Bookings",
      content: "All payments are processed securely. Once a pass is booked, it is subject to the specific gym's availability and our internal refund policy. PassFit reserves the right to cancel bookings in case of fraudulent activity."
    },
    {
      title: "5. Intellectual Property",
      content: "PassFit and all its contents are the exclusive property of AICLEX TECHNOLOGIES. You may not reproduce, distribute, or create derivative works from our platform without express written permission."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8 md:p-16 lg:p-24 space-y-16 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                Terms of <span className="text-brand-blue">Service</span>
            </h1>
            <div className="flex items-center space-x-4">
                <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">Last Updated: March 2026</p>
                <div className="h-[1px] w-20 bg-white/10" />
                <p className="text-brand-green text-[10px] font-black uppercase tracking-widest">Powered by AICLEX TECHNOLOGIES</p>
            </div>
        </div>

        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4 p-10 bg-zinc-900 border border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">{section.title}</h2>
               <p className="text-slate-400 leading-relaxed font-medium">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-16 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">© 2026 AICLEX TECHNOLOGIES • LEGAL DIVISION</p>
        </div>
      </div>
    </div>
  );
}
