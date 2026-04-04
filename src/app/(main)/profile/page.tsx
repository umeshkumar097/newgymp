import React from "react";
import { User, Settings, Bell, ShieldCheck, CreditCard, ChevronRight, Mail, Heart, Zap, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LogoutButton } from "@/components/profile/LogoutButton";
import Image from "next/image";

export default async function ProfilePage() {
  // 1. Get user from NextAuth session
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth");
  }

  // 2. Fetch the user from Prisma with booking count
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email },
    include: {
      supportTickets: {
        orderBy: { createdAt: "desc" }
      },
      _count: {
        select: { bookings: true }
      }
    }
  });

  if (!user) {
    redirect("/auth");
  }

  const menuItems = [
    { icon: CreditCard, label: "My Passes", color: "text-purple-500", bg: "bg-purple-500/10", href: "/passes", sub: "View active plans" },
    { icon: Bell, label: "Notifications", color: "text-brand-blue", bg: "bg-brand-blue/10", href: "#", sub: "Updates & Alerts" },
    { icon: ShieldCheck, label: "Security", color: "text-brand-green", bg: "bg-brand-green/10", href: "#", sub: "Privacy settings" },
    { icon: Heart, label: "Saved Gyms", color: "text-red-500", bg: "bg-red-500/10", href: "#", sub: "Your favorites" },
  ];

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name || "PassFit"}`;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 uppercase tracking-tight font-outfit">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
             <User size={12} className="text-brand-blue" />
             <span className="text-[10px] font-black text-brand-blue tracking-[0.2em]">Partner Portal Access</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter italic">MY PROFILE</h1>
          <p className="text-zinc-500 text-sm font-medium lowercase italic tracking-normal opacity-70">Personal settings and gym access management</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: User Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-zinc-900/60 rounded-[3.5rem] border border-white/5 p-10 space-y-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none transform rotate-12">
                 <User size={240} />
              </div>
              
              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-950 border-2 border-white/5 flex items-center justify-center overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:rotate-6 group-hover:scale-110">
                        <Image 
                            src={avatarUrl} 
                            alt="Profile"
                            width={128} 
                            height={128}
                            className="w-full h-full object-cover scale-110"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center text-zinc-950 shadow-xl border-4 border-zinc-900 group-hover:scale-110 transition-transform">
                        <Zap size={20} fill="currentColor" strokeWidth={3} />
                    </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white tracking-tighter italic">{user.name || "PassFit Member"}</h2>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="text-[10px] font-black text-zinc-400 tracking-widest lowercase">{user.email || "Guest Account"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-10 grid grid-cols-2 gap-4 border-t border-white/5">
                 <div className="text-center p-6 rounded-3xl bg-zinc-950/50 border border-white/5 group-hover:border-brand-green/20 transition-all">
                    <div className="text-2xl font-black text-white italic">{user._count?.bookings || 0}</div>
                    <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] uppercase mt-1">Sessions</div>
                 </div>
                 <div className="text-center p-6 rounded-3xl bg-zinc-950/50 border border-white/5 group-hover:border-brand-blue/20 transition-all opacity-40">
                    <div className="text-2xl font-black text-white italic">--</div>
                    <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] uppercase mt-1">Active</div>
                 </div>
              </div>

              <LogoutButton />
            </div>
          </div>

          {/* Right Column: Menu Options */}
          <div className="w-full lg:w-2/3 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map((item) => (
                  <Link key={item.label} href={item.href} className={cn(
                    "group relative overflow-hidden",
                    item.href === "#" && "pointer-events-none opacity-50"
                  )}>
                    <div className="flex items-center justify-between p-8 rounded-[3rem] bg-zinc-900/40 border border-white/5 hover:border-brand-green/30 transition-all cursor-pointer h-full box-border shadow-xl shadow-black/40">
                      <div className="flex items-center space-x-6">
                        <div className={cn(
                          "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border border-white/5 transition-all group-hover:scale-110 group-hover:rotate-6 shadow-lg",
                          item.bg, item.color
                        )}>
                          <item.icon size={26} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-lg font-black text-white tracking-widest uppercase italic">{item.label}</span>
                          <p className="text-[10px] text-zinc-600 font-bold tracking-widest lowercase italic opacity-80">{item.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-zinc-800 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
             </div>

             {/* Support Card */}
             <div className="mt-10 p-12 rounded-[4rem] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/5 blur-[120px] rounded-full group-hover:bg-brand-green/10 transition-colors" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-blue/5 blur-[100px] rounded-full" />
                
                <div className="space-y-6 relative z-10 text-center lg:text-left">
                   <div className="inline-flex items-center space-x-3 text-brand-green">
                      <MessageSquare size={20} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Premium Support 24/7</span>
                   </div>
                   <h3 className="text-4xl font-black text-white tracking-tighter italic leading-none">NEED EXCLUSIVE<br/><span className="text-brand-green">ASSISTANCE?</span></h3>
                   <p className="text-sm text-zinc-500 max-w-sm lowercase opacity-80 leading-relaxed font-inter italic tracking-normal">Our dedicated concierge team is ready to resolve your bookings or gym access issues instantly.</p>
                </div>
                
                <Link 
                  href="/support"
                  className="bg-white text-zinc-950 font-black px-14 py-7 rounded-[2rem] text-xs tracking-[0.3em] shadow-2xl relative z-10 hover:scale-105 active:scale-95 transition-all uppercase whitespace-nowrap"
                >
                   Raise Dispute
                </Link>
             </div>

             {/* Tickets History */}
             {user.supportTickets.length > 0 && (
                <div className="space-y-6">
                   <h3 className="text-xl font-black text-white italic tracking-widest pl-6 uppercase">Dispute History</h3>
                   <div className="bg-zinc-900 shadow-2xl rounded-[3rem] border border-white/5 overflow-hidden">
                      {user.supportTickets.map((ticket: any) => (
                        <div key={ticket.id} className="p-8 border-b last:border-0 border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                           <div className="flex items-center space-x-6">
                              <div className={cn(
                                "w-3 h-3 rounded-full blur-[2px]",
                                ticket.status === "OPEN" ? "bg-orange-500 animate-pulse" : 
                                ticket.status === "RESOLVED" ? "bg-brand-green" : "bg-brand-blue"
                              )} />
                              <div>
                                 <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{ticket.ticketId} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                 <div className="text-sm font-bold text-white uppercase tracking-tight mt-1">{ticket.subject}</div>
                              </div>
                           </div>
                           <div className={cn(
                             "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                             ticket.status === "OPEN" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                             ticket.status === "RESOLVED" ? "bg-brand-green/10 text-brand-green border-brand-green/20" :
                             "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                           )}>
                              {ticket.status}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
