import React from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Direct assistance for bookings and partner support.",
      value: "+91 84494 88090",
      href: "tel:+918449488090",
      color: "text-brand-blue",
      bg: "bg-brand-blue/10"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "For partnership inquiries and general support.",
      value: "info@passfit.in",
      href: "mailto:info@passfit.in",
      color: "text-brand-green",
      bg: "bg-brand-green/10"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Instant chat support for quick resolutions.",
      value: "Chat on WhatsApp",
      href: "https://wa.me/918449488090",
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 space-y-20">
        
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20">
             <Clock size={12} className="text-brand-green" />
             <span className="text-[10px] font-black text-brand-green tracking-[0.2em] uppercase">24/7 Dedicated Support</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black font-outfit leading-none tracking-tighter italic">
            Get in <span className="text-brand-green">Touch</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl leading-relaxed max-w-2xl italic">
            Need help with a session or looking to partner your fitness center? We&apos;re here to ensure your PassFit experience is world-class.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method) => (
            <a 
              key={method.title} 
              href={method.href}
              className="group p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-brand-green/30 transition-all duration-500"
            >
              <div className="space-y-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110 group-hover:rotate-3 ${method.bg} ${method.color}`}>
                  <method.icon size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black italic tracking-tight">{method.title}</h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">{method.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <span className="text-sm font-black text-brand-green tracking-widest uppercase">{method.value}</span>
                   <ArrowRight size={16} className="text-zinc-800 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Support Card / Partner CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
            <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-brand-blue/10 to-zinc-900 border border-brand-blue/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full" />
                <div className="relative z-10 space-y-6">
                    <ShieldCheck size={48} className="text-brand-blue transform group-hover:scale-110 transition-transform" />
                    <h2 className="text-3xl font-black font-outfit italic tracking-tighter uppercase leading-none">Partner With Us</h2>
                    <p className="text-zinc-400 text-sm italic leading-relaxed">Boost your gym revenue by listing on India&apos;s most premium marketplace. Join the network of 500+ elite partners.</p>
                    <Link href="/partner/onboarding" className="inline-flex items-center space-x-3 bg-brand-blue text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-blue/20">
                        <span>List your gym</span>
                        <Zap size={14} fill="white" />
                    </Link>
                </div>
            </div>

            <div className="bg-zinc-900/60 rounded-[3.5rem] border border-white/5 p-12 flex flex-col justify-center space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Head Office</h3>
                  <div className="space-y-2 italic">
                     <p className="text-lg font-black text-white leading-tight">Palasia Square, Indore</p>
                     <p className="text-zinc-500 text-sm font-medium">Madhya Pradesh, 452001, India</p>
                  </div>
               </div>
               <div className="w-full h-px bg-white/5" />
               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] text-center italic">A Product by Aiclex Technologies Pvt. Ltd.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
