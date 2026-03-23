"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationSearch } from "./LocationSearch";

interface HeaderProps {
  userInitials?: string;
  avatarUrl?: string; // Add this
  isLoggedIn?: boolean;
}

export function Header({ userInitials = "PF", avatarUrl, isLoggedIn = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  // Determine a deterministic avatar seed if no avatarUrl provided
  const displayAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInitials}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4",
      scrolled ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl shadow-black/50" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
             <span className="text-white font-black text-xl italic leading-none ml-0.5">P</span>
          </div>
          <h1 className="text-2xl font-black font-outfit tracking-tighter text-white">
            Pass<span className="text-brand-green italic">Fit</span>
          </h1>
        </Link>

        {/* Navigation - Desktop Only */}
        <nav className="hidden md:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
           <Link href="/explore" className="hover:text-brand-green transition-colors">Explore</Link>
           <Link href="/passes" className="hover:text-brand-green transition-colors">My Passes</Link>
           <Link href="/about" className="hover:text-brand-green transition-colors">About</Link>
        </nav>

        {/* Global Search & Location */}
        <div className="hidden lg:flex items-center space-x-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 hover:border-brand-green/30 transition-all group shadow-inner">
            <LocationSearch 
              initialLocation="Indore, MP"
              onLocationSelect={() => {}} 
            />
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center space-x-3">
                <Search size={14} className="text-zinc-500 group-focus-within:text-brand-green transition-colors" />
                <input 
                   type="text" 
                   placeholder="Search gyms..." 
                   className="bg-transparent border-none outline-none text-[10px] font-black text-white placeholder:text-zinc-700 w-32 uppercase tracking-widest"
                />
            </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
           {isLoggedIn ? (
             <Link href="/profile" className="flex items-center space-x-3 p-1 rounded-full hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-xl group-hover:border-brand-green/50 transition-all">
                    <img 
                      src={displayAvatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                </div>
                <ChevronDown size={14} className="text-zinc-700 hidden md:block group-hover:text-brand-green transition-colors" />
             </Link>
           ) : (
             <Link href="/auth" className="bg-brand-green text-zinc-950 font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand-green/20 hover:scale-105 active:scale-95 transition-all">
                Login / Join
             </Link>
           )}
        </div>
      </div>
    </header>
  );
}
