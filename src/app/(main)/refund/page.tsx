import React from "react";

export const metadata = {
  title: "Cancellation & Refund | PassFit Trust Policy",
  description: "Review our policies regarding booking cancellations and refunds. Transparent and fair terms for all PassFit users, powered by AICLEX TECHNOLOGIES.",
};

export default function RefundPolicy() {
  const sections = [
    {
      title: "1. Cancellation Window",
      content: "Users can cancel their gym pass bookings up to 2 hours before the scheduled time slot for a full refund. Cancellations made within 2 hours of the slot are not eligible for a refund."
    },
    {
      title: "2. Refund Processing",
      content: "Once a refund is initiated, it typically takes 5-7 business days to reflect in your original payment method. All refunds are processed via our secure payment partner, Razorpay."
    },
    {
      title: "3. Non-Refundable Items",
      content: "Discounted promotional passes, long-term memberships already activated, and 'No-Show' bookings are strictly non-refundable."
    },
    {
      title: "4. Dispute Resolution",
      content: "If you face any issues at the gym (e.g., facility closed, denied entry), please raise a dispute via the Support Tickets section within 24 hours. AICLEX TECHNOLOGIES will investigate and resolve the issue fairly."
    },
    {
      title: "5. AICLEX TECHNOLOGIES Guarantee",
      content: "As an AICLEX TECHNOLOGIES product, we prioritize user satisfaction. Our support team is available to assist with any payment-related discrepancies."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8 md:p-16 lg:p-24 space-y-16 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                Refund <span className="text-orange-500">Policy</span>
            </h1>
            <div className="flex items-center space-x-4">
                <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">Last Updated: March 2026</p>
                <div className="h-[1px] w-20 bg-white/10" />
                <p className="text-brand-green text-[10px] font-black uppercase tracking-widest">A Trust Product of AICLEX TECHNOLOGIES</p>
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
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">© 2026 AICLEX TECHNOLOGIES • CUSTOMER SUCCESS UNIT</p>
        </div>
      </div>
    </div>
  );
}
