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
    { icon: CreditCard, label: "My Passes", color: "text-purple-600", bg: "bg-purple-100", href: "/passes", sub: "View active plans" },
    { icon: Bell, label: "Notifications", color: "text-brand-blue", bg: "bg-blue-100", href: "#", sub: "Updates & Alerts" },
    { icon: ShieldCheck, label: "Security", color: "text-brand-green", bg: "bg-green-100", href: "#", sub: "Privacy settings" },
    { icon: Heart, label: "Saved Gyms", color: "text-red-500", bg: "bg-red-100", href: "#", sub: "Your favorites" },
  ];

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name || "PassFit"}`;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans pb-32">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
             <User size={12} className="text-brand-blue" />
             <span className="text-[10px] font-black text-brand-blue tracking-[0.2em] uppercase">Private Member Area</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading text-slate-900 leading-none tracking-tighter uppercase">My Profile</h1>
          <p className="text-slate-500 text-sm font-medium">Personal settings and gym access management</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: User Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-10 space-y-10 relative overflow-hidden group shadow-xl shadow-slate-200/50">
              <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none transform rotate-12">
                 <User size={240} className="text-slate-900" />
              </div>
              
              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-700 group-hover:rotate-3 group-hover:scale-105">
                        <Image 
                            src={avatarUrl} 
                            alt="Profile"
                            width={128} 
                            height={128}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-brand-green flex items-center justify-center text-white shadow-xl border-4 border-slate-50 group-hover:scale-110 transition-transform">
                        <Zap size={18} fill="currentColor" strokeWidth={3} />
                    </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight uppercase leading-none">{user.name || "Member"}</h2>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10">
                    <span className="text-[10px] font-black text-brand-blue tracking-widest lowercase">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-10 grid grid-cols-2 gap-4 border-t border-slate-200">
                 <div className="text-center p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all group-hover:border-brand-green/20">
                    <div className="text-2xl font-extrabold text-slate-900">{user._count?.bookings || 0}</div>
                    <div className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase mt-1">Sessions</div>
                 </div>
                 <div className="text-center p-6 rounded-3xl bg-white border border-slate-100 shadow-sm opacity-50">
                    <div className="text-2xl font-extrabold text-slate-900">0</div>
                    <div className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase mt-1">Active</div>
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
                    item.href === "#" && "pointer-events-none opacity-60"
                  )}>
                    <div className="flex items-center justify-between p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:border-brand-green/30 hover:bg-white transition-all cursor-pointer h-full box-border shadow-md hover:shadow-xl hover:shadow-slate-200/50">
                      <div className="flex items-center space-x-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                          item.bg, item.color
                        )}>
                          <item.icon size={24} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-black text-slate-900 tracking-widest uppercase italic">{item.label}</span>
                          <p className="text-[10px] text-slate-400 font-bold tracking-widest lowercase opacity-80">{item.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
             </div>

             {/* Support Card */}
             <div className="mt-10 p-12 rounded-[3.5rem] bg-slate-900 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full group-hover:bg-brand-green/15 transition-colors" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-brand-blue/10 blur-[100px] rounded-full" />
                
                <div className="space-y-6 relative z-10 text-center lg:text-left">
                   <div className="inline-flex items-center space-x-3 text-brand-green">
                      <MessageSquare size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Premium Support 24/7</span>
                   </div>
                   <h3 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Need assistance with<br/><span className="text-brand-green">Your bookings?</span></h3>
                   <p className="text-sm text-slate-400 max-w-sm font-medium leading-relaxed opacity-80 font-sans tracking-normal">Our dedicated team is ready to resolve any access or payment issues instantly.</p>
                </div>
                
                <Link 
                  href="/support"
                  className="bg-white text-slate-900 font-black px-12 py-6 rounded-2xl text-xs tracking-[0.2em] shadow-xl relative z-10 hover:scale-105 active:scale-95 transition-all uppercase whitespace-nowrap"
                >
                   Raise Dispute
                </Link>
             </div>

             {/* Tickets History */}
             {user.supportTickets.length > 0 && (
                <div className="space-y-6">
                   <h3 className="text-sm font-black text-slate-400 tracking-widest pl-4 uppercase">Support History</h3>
                   <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                      {user.supportTickets.map((ticket: any) => (
                        <div key={ticket.id} className="p-8 border-b last:border-0 border-slate-200/50 flex items-center justify-between hover:bg-white transition-all">
                           <div className="flex items-center space-x-6">
                              <div className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                ticket.status === "OPEN" ? "bg-orange-500 animate-pulse" : 
                                ticket.status === "RESOLVED" ? "bg-brand-green" : "bg-brand-blue"
                              )} />
                              <div>
                                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ticket.ticketId} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                 <div className="text-xs font-extrabold text-slate-900 uppercase tracking-tight mt-1">{ticket.subject}</div>
                              </div>
                           </div>
                           <div className={cn(
                             "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                             ticket.status === "OPEN" ? "bg-orange-500/10 text-orange-600 border-orange-200" :
                             ticket.status === "RESOLVED" ? "bg-green-500/10 text-green-600 border-green-200" :
                             "bg-brand-blue/10 text-brand-blue border-blue-200"
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
