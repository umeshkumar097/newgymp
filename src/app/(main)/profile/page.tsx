import React from "react";
import { User, Settings, Bell, ShieldCheck, CreditCard, ChevronRight, Mail, Heart, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/profile/LogoutButton";
import Image from "next/image";

export default async function ProfilePage() {
  // 1. Get user from session cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  // 2. Fetch the user from Prisma
  const user = userId 
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;

  if (!user) {
    redirect("/auth");
  }

  const menuItems = [
    { icon: Bell, label: "Notifications", color: "text-brand-blue", bg: "bg-brand-blue/10", href: "#" },
    { icon: ShieldCheck, label: "Privacy & Security", color: "text-brand-green", bg: "bg-brand-green/10", href: "#" },
    { icon: CreditCard, label: "Payment History", color: "text-purple-500", bg: "bg-purple-500/10", href: "/passes" },
    { icon: Heart, label: "Saved Gyms", color: "text-red-500", bg: "bg-red-500/10", href: "#" },
    { icon: Settings, label: "Account Settings", color: "text-zinc-400", bg: "bg-white/5", href: "#" },
  ];

  const initials = user.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "PF";

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name || "PassFit"}`;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 uppercase tracking-tight">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20">
             <User size={12} className="text-brand-blue" />
             <span className="text-[10px] font-black text-brand-blue tracking-[0.2em]">My Account</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-outfit text-white leading-none tracking-tighter">Profile</h1>
          <p className="text-zinc-500 text-sm font-medium lowercase italic tracking-normal">Manage your settings and fitness preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: User Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-zinc-900/60 rounded-[3rem] border border-white/5 p-8 space-y-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <User size={180} />
              </div>
              
              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="relative group/avatar">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-brand-blue/20 to-brand-green/20 border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                        <Image 
                            src={avatarUrl} 
                            alt={user.name || "Profile"} 
                            width={112} 
                            height={112}
                            className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-brand-green flex items-center justify-center text-zinc-950 shadow-lg border-4 border-zinc-900 group-hover:scale-110 transition-transform">
                        <Zap size={16} fill="currentColor" strokeWidth={3} />
                    </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tight italic">{user.name || "PassFit User"}</h2>
                  <p className="text-zinc-500 text-[10px] font-bold tracking-widest flex items-center justify-center lowercase tracking-normal">
                    <Mail size={12} className="mr-2 text-brand-green" />
                    {user.email || "No email linked"}
                  </p>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4 border-t border-white/5">
                 <div className="text-center p-5 rounded-3xl bg-zinc-950 border border-white/5 group-hover:border-brand-blue/20 transition-colors">
                    <div className="text-lg font-black text-white">08</div>
                    <div className="text-[8px] font-bold text-zinc-600 tracking-widest uppercase">Sessions</div>
                 </div>
                 <div className="text-center p-5 rounded-3xl bg-zinc-950 border border-white/5 group-hover:border-brand-green/20 transition-colors">
                    <div className="text-lg font-black text-white">3.2k</div>
                    <div className="text-[8px] font-bold text-zinc-600 tracking-widest uppercase">Calories</div>
                 </div>
              </div>

              <LogoutButton />
            </div>
          </div>

          {/* Right Column: Menu Options */}
          <div className="w-full lg:w-2/3 space-y-4 font-outfit">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <Link key={item.label} href={item.href} className="group">
                    <div className="flex items-center justify-between p-6 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-brand-green/30 transition-all cursor-pointer h-full box-border shadow-lg shadow-black/20">
                      <div className="flex items-center space-x-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 transition-all group-hover:scale-110 group-hover:rotate-3",
                          item.bg, item.color
                        )}>
                          <item.icon size={22} />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-black text-white tracking-widest">{item.label}</span>
                          <p className="text-[10px] text-zinc-600 font-bold tracking-widest lowercase tracking-normal opacity-60">Customization & Privacy</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-zinc-800 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
             </div>

             {/* Support Card */}
             <div className="mt-8 p-12 rounded-[3.5rem] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/5 blur-[100px] rounded-full group-hover:bg-brand-green/10 transition-colors" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-blue/5 blur-[60px] rounded-full" />
                
                <div className="space-y-4 relative z-10 text-center md:text-left">
                   <h3 className="text-3xl font-black text-white tracking-tight italic">Need Quick Support?</h3>
                   <p className="text-sm text-zinc-500 max-w-sm lowercase opacity-80 leading-relaxed font-inter">Our dedicated assistance team is available 24/7 to solve your gym access and booking issues.</p>
                </div>
                <button className="bg-white text-zinc-950 font-black px-12 py-6 rounded-3xl text-xs tracking-[0.2em] shadow-2xl relative z-10 hover:scale-105 active:scale-95 transition-all uppercase whitespace-nowrap">
                   Contact Support
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
