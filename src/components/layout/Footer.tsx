"use client";

import React from "react";
import Link from "next/link";
import { 
  Instagram, Twitter, Facebook, Mail, Phone, 
  MapPin, Globe, ShieldCheck, Zap, ArrowRight 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/5 pt-20 pb-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center shadow-lg shadow-brand-green/20">
               <span className="text-[#0F172A] font-black text-lg leading-none ml-0.5">P</span>
            </div>
            <h1 className="text-xl font-extrabold font-heading tracking-tighter text-white uppercase">
              Pass<span className="text-brand-green">Fit</span>
            </h1>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            India&apos;s most premium gym marketplace. Instant access to elite fitness centers with a single day pass. No commitments, just results.
          </p>
          <div className="flex space-x-4">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-brand-green hover:bg-white/10 transition-all">
              <Instagram size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-white/10 transition-all">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-brand-green hover:bg-white/10 transition-all">
              <Facebook size={18} />
            </button>
          </div>
        </div>

        {/* Company Links */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Company</h3>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><Link href="/about" className="hover:text-brand-green transition-colors">About Us</Link></li>
            <li><Link href="/explore" className="hover:text-brand-green transition-colors">Explore Gyms</Link></li>
            <li><Link href="/contact" className="hover:text-brand-green transition-colors">Contact Support</Link></li>
            <li><Link href="/blog" className="hover:text-brand-green transition-colors">Fitness Blog</Link></li>
          </ul>
        </div>

        {/* Legal & Partner */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Legal & Partner</h3>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><Link href="/privacy" className="hover:text-brand-green transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-brand-green transition-colors">Terms of Service</Link></li>
            <li><Link href="/refund" className="hover:text-brand-green transition-colors">Refund Policy</Link></li>
            <li className="pt-2">
              <Link href="/partner/login" className="inline-flex items-center space-x-2 text-brand-green hover:text-white transition-all">
                <ShieldCheck size={16} />
                <span>Gym Owner Login</span>
              </Link>
            </li>
            <li>
              <Link href="/partner/onboarding" className="inline-flex items-center space-x-2 text-brand-blue hover:text-white transition-colors">
                <Zap size={16} />
                <span>Register your Gym</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-400">
              <Mail size={16} className="text-brand-green" />
              <span>support@passfit.in</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-400">
              <Phone size={16} className="text-brand-blue" />
              <span>+91 84494 88090</span>
            </div>
            <div className="flex items-center space-x-3 text-sm font-medium text-slate-400">
              <MapPin size={16} className="text-slate-600" />
              <span>Indore, Madhya Pradesh, India</span>
            </div>
          </div>
          <div className="relative pt-4">
             <input 
                type="email" 
                placeholder="Join Newsletter" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-brand-green/50 transition-all"
             />
             <button className="absolute right-2 top-6 bg-brand-green text-[#0F172A] p-1.5 rounded-lg hover:bg-white transition-colors">
                <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} PassFit. All rights reserved.
        </p>
        
        {/* Attribution - AS REQUESTED */}
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <Globe size={12} className="text-slate-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                A Product by <span className="text-white">Aiclex Technologies</span>
              </span>
           </div>
        </div>

        <div className="text-[9px] text-slate-800 font-bold uppercase tracking-[0.5em]">
           Premium Gym Marketplace v3.0
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="max-w-7xl mx-auto mt-12 p-6 rounded-3xl bg-slate-900/40 border border-white/5">
         <p className="text-[9px] text-slate-600 font-medium leading-relaxed uppercase tracking-wider text-center">
           Disclaimer: PassFit is a marketplace platform providing access to third-party fitness centers. Exercises and facility usage involve inherent risks. Users are advised to Consult a physician before starting any workout program.
         </p>
      </div>
    </footer>
  );
}
