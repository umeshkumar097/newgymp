import React from "react";

export const metadata = {
  title: "Privacy Policy | PassFit Data Protection",
  description: "Learn how PassFit protects your personal information and gym booking data. Your privacy and security are our top priorities.",
};

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Data Collection",
      content: "We collect personal information such as name, email address, phone number, and location data when you register an account or use our platform. This information is essential for providing our services, including gym discoverability and booking management."
    },
    {
      title: "2. How We Use Your Data",
      content: "Your data is used to facilitate gym bookings, process payments via secure third-party gateways (Razorpay), and provide personalized fitness recommendations. We also use your contact details to send important updates and promotional offers."
    },
    {
      title: "3. Data Security",
      content: "We implement industry-standard security measures to protect your personal information. All sensitive data is encrypted, and we do not store your credit card or payment credentials on our servers."
    },
    {
      title: "4. Third-Party Sharing",
      content: "We share necessary details with our partner gyms and payment processors to complete your transactions. We do not sell your personal information to third-party marketing agencies."
    },
    {
        title: "5. AICLEX TECHNOLOGIES Product",
        content: "PassFit is an official product developed and maintained by AICLEX TECHNOLOGIES. All intellectual property and trademarks belong to AICLEX TECHNOLOGIES."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8 md:p-16 lg:p-24 space-y-16 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                Privacy <span className="text-brand-green">Protocol</span>
            </h1>
            <div className="flex items-center space-x-4">
                <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">Last Updated: March 2026</p>
                <div className="h-[1px] w-20 bg-white/10" />
                <p className="text-brand-blue text-[10px] font-black uppercase tracking-widest">A Product of AICLEX TECHNOLOGIES</p>
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
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">© 2026 AICLEX TECHNOLOGIES • ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
}
