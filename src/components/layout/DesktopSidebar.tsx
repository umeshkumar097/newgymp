"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Ticket, User, Heart, ShieldCheck, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Passes", href: "/passes", icon: Ticket },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Profile", href: "/profile", icon: User },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen bg-zinc-950 border-r border-white/5 fixed left-0 top-0 z-40 p-6 space-y-8 overflow-y-auto">
      {/* Brand logo */}
      <div className="px-4 py-8">
        <Link href="/" className="group">
          <h1 className="text-3xl font-black font-outfit tracking-tighter text-white">
            Pass<span className="text-orange-500 italic">Fit</span>
          </h1>
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1 group-hover:text-orange-500 transition-colors">
            Premium Fitness Access
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-4 mb-4">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all group relative",
                isActive 
                  ? "bg-orange-500/10 text-orange-500" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
              {isActive && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="space-y-4 pt-8 border-t border-white/5">
        <button className="flex items-center space-x-4 px-4 py-4 rounded-2xl text-zinc-600 hover:bg-white/5 hover:text-white transition-all w-full text-left">
          <Settings size={20} />
          <span className="text-sm font-bold tracking-tight">Settings</span>
        </button>
        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-3">
          <div className="flex items-center space-x-2 text-green-500">
             <ShieldCheck size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">Secured Auth</span>
          </div>
          <p className="text-[9px] text-zinc-600 font-medium">Your data is safe with our premium encryption.</p>
        </div>
      </div>
    </aside>
  );
}
