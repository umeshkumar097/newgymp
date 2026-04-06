"use client";

import React from "react";
import { LayoutDashboard, Store, Users, BarChart, Settings, Bell, LogOut, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.refresh();
        router.push("/auth");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Gym Moderation", icon: Store, href: "/admin/gyms" },
    { name: "User Management", icon: Users, href: "/admin/users" },
    { name: "Analytics", icon: BarChart, href: "/admin/analytics" },
    { name: "Rescue Center", icon: Zap, href: "/admin/intents" },
    { name: "Support Tickets", icon: MessageSquare, href: "/admin/support" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Premium Light Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200/60 flex flex-col hidden md:flex sticky top-0 h-screen shadow-sm">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            PassFit <br/><span className="text-brand-green">Admin</span>
          </h1>
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
        </div>
        
        <nav className="flex-1 p-6 space-y-2 pt-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em]",
                  isActive 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200/50 scale-[1.02]" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-brand-green" : "text-slate-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-4 w-full text-slate-600 hover:text-red-600 text-[10px] uppercase font-black tracking-[0.2em] transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-3xl border-b border-slate-200/40 flex items-center justify-between px-10 sticky top-0 z-[100] shadow-sm">
          <div className="flex flex-col">
             <h2 className="text-xl font-black text-slate-900 leading-none">ADMIN HUB</h2>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Management Portal</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-lg transition-all active:scale-95">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-green rounded-full border-2 border-white shadow-sm" />
            </button>
            
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-100">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none">Vipul Kumar</p>
                  <p className="text-[9px] font-black text-brand-green uppercase tracking-widest mt-1">Administrator</p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-xs text-white shadow-xl shadow-slate-200 border border-slate-800">
                  VK
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-10 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {children}
        </main>
        
        {/* Subtle Background Elements */}
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full -mr-48 -mb-48 pointer-events-none" />
      </div>
    </div>
  );
}
