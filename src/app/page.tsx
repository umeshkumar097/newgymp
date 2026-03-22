"use client";

import React, { useState } from "react";
import { Search, MapPin, Zap, Flame, Trophy, Star, ChevronRight, Play } from "lucide-react";
import { gyms } from "@/lib/mock-data";
import { GymCard } from "@/components/gyms/GymCard";
import { motion } from "framer-motion";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      
      {/* Desktop Hero Section */}
      <section className="hidden md:block relative h-[600px] w-full overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 pt-20">
          <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-green/10 border border-brand-green/20 backdrop-blur-md">
               <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">Elevate Your Fitness Journey</span>
            </div>
            
            <h1 className="text-7xl font-black font-outfit text-white tracking-tighter leading-[0.9] uppercase">
              Premium Gyms<br />
              <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent italic">On-Demand</span>
            </h1>
            
            <p className="text-lg text-zinc-400 font-medium max-w-lg leading-relaxed">
              No memberships. No long-term contracts. Just instant access to the city&apos;s most elite fitness centers with a single tap.
            </p>

            <div className="flex items-center space-x-4 pt-4">
              <button className="bg-gradient-to-r from-brand-blue to-brand-green text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-brand-blue/30 flex items-center space-x-3 hover:scale-105 transition-all uppercase tracking-widest text-xs">
                <span>Start Exploring</span>
                <ChevronRight size={18} />
              </button>
              <button className="bg-white/5 border border-white/10 text-white font-black px-8 py-4 rounded-2xl flex items-center space-x-3 hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
                <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
                  <Play size={10} className="fill-white ml-0.5" />
                </div>
                <span>How it works</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stat on Scroll */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:flex space-x-12 p-8 rounded-[3rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/10">
           <div className="text-center">
              <div className="text-3xl font-black font-outfit text-white">500+</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Premium Gyms</div>
           </div>
           <div className="w-px h-12 bg-white/5" />
           <div className="text-center">
              <div className="text-3xl font-black font-outfit text-white">5k+</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Users</div>
           </div>
           <div className="w-px h-12 bg-white/5" />
           <div className="text-center">
              <div className="text-3xl font-black font-outfit text-white">4.9/5</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">User Rating</div>
           </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 space-y-16">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden space-y-8">
           <h1 className="text-4xl font-black font-outfit tracking-tighter text-white">
              Pass<span className="text-brand-green italic">Fit</span>
           </h1>
           {/* Search and Filters here if needed */}
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-outfit text-white tracking-tighter uppercase">Discover Premium Hubs</h2>
            <p className="text-zinc-500 text-sm font-medium">Explore the best gyms near you in <span className="text-brand-green font-bold">Indore</span></p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex p-1 bg-zinc-900 border border-white/5 rounded-2xl">
                {["Day Pass", "Weekly", "Group"].map((f) => (
                  <button key={f} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all rounded-xl hover:bg-white/5">{f}</button>
                ))}
             </div>
          </div>
        </div>

        {/* Gym Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>

        {/* Premium Banner */}
        <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900 p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 group cursor-pointer hover:border-brand-green/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-transparent opacity-50" />
          <div className="relative z-10 space-y-6 max-w-xl">
             <h2 className="text-5xl font-black font-outfit text-white tracking-tighter leading-none mb-4 uppercase">
               Work out on your<br />own terms
             </h2>
             <p className="text-zinc-500 font-medium">
               Upgrade your fitness routine with the versatility of PassFit. No sign-up fees, no long-term commitments. Just real fitness.
             </p>
             <button className="bg-white text-zinc-950 font-black px-10 py-5 rounded-[2rem] text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
               Join PassFit Today
             </button>
          </div>
          <div className="relative z-10 w-full md:w-[400px] h-64 rounded-[2rem] overflow-hidden shadow-2xl skew-y-3 group-hover:skew-y-0 transition-transform duration-1000">
             <div className="absolute inset-0 bg-brand-gradient opacity-60" />
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center" />
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-12 border-t border-white/5 text-center mt-20">
         <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[1em]">Version 2.0.3 • Powered by Aiclex</p>
      </footer>
    </div>
  );
}
