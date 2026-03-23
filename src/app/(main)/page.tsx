import React from "react";
import { Search, MapPin, Zap, Star, ChevronRight, Play, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GymCard } from "@/components/gyms/GymCard";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "PassFit | Gym Day Pass & Premium Fitness Hubs Near Me",
  description: "Experience the best gyms with PassFit. Get instant daily access to premium fitness hubs. Search for gym day passes or find a gym near you with top-tier amenities in Indore. No commitments, just performance.",
};

export default async function HomePage() {
  const gyms = await prisma.gym.findMany({
    where: { status: "APPROVED" },
    include: {
      plans: {
        orderBy: { price: "asc" },
        take: 1
      }
    },
    take: 8
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-slate-200 overflow-x-hidden font-sans">
      
      {/* Desktop Hero Section */}
      <section className="hidden md:block relative h-[700px] w-full overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-[#0F172A]/20 backdrop-brightness-50" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center px-6">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-brand-green/10 border border-brand-green/20 backdrop-blur-3xl shadow-2xl">
               <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-green">The Future of Fitness is Here</span>
            </div>
            
            <h1 className="text-8xl lg:text-9xl font-extrabold font-heading text-white tracking-tighter leading-[0.85] uppercase">
              ELITE HUBS<br />
              <span className="text-brand-green drop-shadow-2xl">ON-DEMAND</span>
            </h1>
            
            <p className="text-xl text-slate-400 font-medium max-w-xl leading-relaxed opacity-80 pl-2">
              Instant access to India&apos;s most premium fitness centers. No memberships. No commitments. Just pure performance.
            </p>

            <div className="flex items-center space-x-6 pt-6">
              <Link href="/explore" className="bg-gradient-to-r from-brand-blue/80 to-brand-green/80 text-white font-bold px-12 py-6 rounded-[2rem] shadow-[0_20px_50px_rgba(59,130,246,0.15)] flex items-center space-x-4 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs group backdrop-blur-sm">
                <span>Start Exploring</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold px-10 py-6 rounded-[2rem] flex items-center space-x-4 hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-xs">
                <div className="w-8 h-8 rounded-2xl bg-brand-green flex items-center justify-center shadow-lg shadow-brand-green/20">
                  <Play size={12} className="fill-[#0F172A] text-[#0F172A] ml-0.5" />
                </div>
                <span>Watch Story</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 right-12 z-20 hidden lg:flex space-x-16 p-10 rounded-[3.5rem] bg-slate-900/40 backdrop-blur-[40px] border border-white/10 shadow-3xl">
           <div className="text-center group">
              <div className="text-4xl font-extrabold font-heading text-white tracking-tighter group-hover:text-brand-green transition-colors">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mt-1">Premium Hubs</div>
           </div>
           <div className="w-px h-14 bg-white/5" />
           <div className="text-center group">
              <div className="text-4xl font-extrabold font-heading text-white tracking-tighter group-hover:text-brand-blue transition-colors">24/7</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mt-1">Support Ops</div>
           </div>
           <div className="w-px h-14 bg-white/5" />
           <div className="text-center group">
              <div className="text-4xl font-extrabold font-heading text-white tracking-tighter group-hover:text-teal-400 transition-colors">4.9/5</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mt-1">User Trust</div>
           </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 md:py-24 space-y-24">
        
        {/* Mobile Welcome Info */}
        <div className="md:hidden space-y-6 pt-10">
           <div className="space-y-2">
              <h2 className="text-5xl font-extrabold font-heading tracking-tighter uppercase leading-none">THE NEW HUB<br/>FOR <span className="text-brand-green">FITNESS</span></h2>
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">Indore&apos;s Global Gym Marketplace</p>
           </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-3 text-brand-green">
               <Zap size={20} fill="currentColor" />
               <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tighter uppercase">FEATURED HUB ACCESS</h2>
            </div>
            <p className="text-slate-500 text-sm font-medium opacity-70">Hand-picked elite centers with verified PassFit protocols in <span className="text-white font-bold underline decoration-brand-green decoration-2 underline-offset-4">INDORE</span></p>
          </div>
          <Link href="/explore" className="inline-flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-brand-green transition-colors group">
            <span>View All Hubs</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gym Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {gyms.length > 0 ? gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          )) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-slate-900/20">
               <p className="text-slate-700 font-bold text-sm uppercase tracking-[0.5em]">Initializing Elite Partner Network...</p>
            </div>
          )}
        </div>

        {/* Premium Banner */}
        <div className="relative rounded-[4rem] overflow-hidden bg-slate-900/60 p-16 md:p-24 border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-16 group cursor-pointer hover:border-brand-green/30 transition-all shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-green/5 opacity-50" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-blue/5 blur-[150px] rounded-full" />
          
          <div className="relative z-10 space-y-8 max-w-2xl">
             <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 uppercase text-[9px] font-bold tracking-widest text-slate-400">
                <span>Exclusive Membership Alternative</span>
             </div>
             <h2 className="text-6xl md:text-7xl font-extrabold font-heading text-white tracking-tighter leading-[0.9] uppercase">
               FITNESS AS<br /><span className="text-brand-green">A SERVICE</span>
             </h2>
             <p className="text-lg text-slate-500 font-medium leading-relaxed opacity-80">
               Break free from rigid memberships. Access premium facilities whenever you want, wherever you are. No startup fees. Ever.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth" className="bg-white text-zinc-950 font-bold px-12 py-6 rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all text-center">
                  JOIN THE MOVEMENT
                </Link>
                <Link href="/partner/onboarding" className="bg-zinc-800 text-white font-bold px-12 py-6 rounded-2xl text-[10px] uppercase tracking-[0.3em] border border-white/5 hover:bg-white hover:text-zinc-950 transition-all text-center">
                  LIST YOUR HUB
                </Link>
             </div>
          </div>
          
          <div className="relative z-10 w-full lg:w-[450px] aspect-square rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-all duration-1000 border border-white/10">
             <div className="absolute inset-0 bg-brand-blue/20 mix-blend-overlay z-10" />
             <Image 
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075" 
                alt="Premium Hub" 
                fill 
                className="object-cover" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-20" />
             <div className="absolute bottom-10 left-10 z-30">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center text-zinc-950 shadow-xl shadow-brand-green/30">
                      <Star size={24} fill="currentColor" />
                   </div>
                   <div>
                      <p className="text-white font-extrabold font-heading text-xl leading-none">PLATINUM</p>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Verified Experience</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-white/5 text-center mt-20 opacity-40">
         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[1em]">Premium Gym Marketplace v2.4.9 • Powered by Aiclex Technologies</p>
      </footer>
    </div>
  );
}
