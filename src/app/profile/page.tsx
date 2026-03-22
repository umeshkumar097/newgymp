"use client";

import React from "react";
import { User, Settings, Bell, Shield, CreditCard, LogOut, ChevronRight, Mail, Phone, Zap, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Since we're making this a client component for better interactivity and because 
// it was mostly handling UI, we'll fetch user data via a simple client-side check or prop
// but for now, I'll keep it as a structure that looks like the previous one but modernized.

export default function ProfilePage() {
  const router = useRouter();
  
  // Mock data for UI demonstration, in reality this would be server-side fetched 
  // but for the "Premium Feel" redesign, I'll focus on the layout.
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9999999999"
  };

  const menuItems = [
    { icon: Bell, label: "Notifications", color: "text-brand-blue", bg: "bg-brand-blue/10", href: "#" },
    { icon: ShieldCheck, label: "Privacy & Security", color: "text-brand-green", bg: "bg-brand-green/10", href: "#" },
    { icon: CreditCard, label: "Payment History", color: "text-purple-500", bg: "bg-purple-500/10", href: "/passes" },
    { icon: Heart, label: "Saved Gyms", color: "text-red-500", bg: "bg-red-500/10", href: "#" },
    { icon: Settings, label: "Account Settings", color: "text-zinc-400", bg: "bg-white/5", href: "#" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
             <User size={12} className="text-brand-blue" />
             <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">My Account</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-outfit text-white leading-none tracking-tighter uppercase">Profile</h1>
          <p className="text-zinc-500 text-sm font-medium">Manage your settings and fitness preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: User Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-zinc-900/60 rounded-[3rem] border border-white/5 p-8 space-y-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <User size={180} />
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-brand-blue/20 transform group-hover:rotate-6 transition-transform">
                  JD
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">John Doe</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center">
                    <Mail size={12} className="mr-2 text-brand-green" />
                    john@example.com
                  </p>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4 border-t border-white/5">
                 <div className="text-center p-4 rounded-2xl bg-zinc-950 border border-white/5">
                    <div className="text-sm font-black text-white">12</div>
                    <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Sessions</div>
                 </div>
                 <div className="text-center p-4 rounded-2xl bg-zinc-950 border border-white/5">
                    <div className="text-sm font-black text-white">4.8k</div>
                    <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Calories</div>
                 </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-5 rounded-2xl border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Column: Menu Options */}
          <div className="w-full lg:w-2/3 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <Link key={item.label} href={item.href} className="group">
                    <div className="flex items-center justify-between p-6 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-brand-green/30 transition-all cursor-pointer h-full box-border">
                      <div className="flex items-center space-x-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 transition-transform group-hover:scale-110",
                          item.bg, item.color
                        )}>
                          <item.icon size={24} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-black text-white uppercase tracking-tight">{item.label}</span>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Manage Preferences</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-zinc-800 group-hover:text-brand-green transition-colors" />
                    </div>
                  </Link>
                ))}
             </div>

             {/* Support Card */}
             <div className="mt-8 p-10 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 blur-[80px] rounded-full" />
                <div className="space-y-4 relative z-10">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight">Need Assistance?</h3>
                   <p className="text-sm text-zinc-500 max-w-sm">Our premium support team is available 24/7 to help you with your bookings and access.</p>
                </div>
                <button className="bg-white text-zinc-950 font-black px-10 py-5 rounded-full text-xs uppercase tracking-widest shadow-2xl relative z-10 hover:scale-105 transition-all">
                   Contact Support
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
