import { TrendingUp, Users, Store, Wallet, ArrowUpRight, ArrowDownRight, Activity, Calendar, Zap, Flame, ShieldCheck, Check, Globe, MousePointer2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { GymStatus } from "@prisma/client";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // Real DB Queries
  const [
    totalRevenueResult,
    userCount,
    gymCount,
    bookingCount,
    recentBookings,
    openTicketsCount,
    pendingGyms,
    platformSettings
  ] = await Promise.all([
     prisma.booking.aggregate({ _sum: { totalAmount: true } }),
     prisma.user.count({ where: { role: "USER" as any } } as any),
     prisma.gym.count({ where: { status: "APPROVED" as any } } as any),
     prisma.booking.count(),
     prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { gym: true, user: true }
     }),
     (prisma as any).supportTicket ? (prisma as any).supportTicket.count({ where: { status: "OPEN" as any } }) : Promise.resolve(0),
     prisma.gym.findMany({
        where: { status: "PENDING" as any },
        take: 3,
        orderBy: { createdAt: "desc" }
     }),
     (prisma as any).platformSetting.findMany({
        where: {
          key: { in: ["COMMISSION_RATE", "DEFAULT_ONBOARDING_FEE"] }
        }
     })
  ]);

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
  const commissionRate = platformSettings.find((s: any) => s.key === "COMMISSION_RATE")?.value || "15";
  const defaultFee = platformSettings.find((s: any) => s.key === "DEFAULT_ONBOARDING_FEE")?.value || "4999";

  const stats = [
    { label: "Total Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}k`, trend: "+14.5%", up: true, icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Active Users", value: userCount.toString(), trend: "+8.2%", up: true, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Partner Hubs", value: gymCount.toString(), trend: "-2.1%", up: false, icon: Store, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Open Tickets", value: openTicketsCount.toString(), trend: "Urgent", up: false, icon: Activity, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-12 font-outfit animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#0B0F19] min-h-screen -m-8 p-8 pb-20">
      {/* Welcome Header */}
      <div className="flex justify-between items-start pt-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-black font-outfit text-white tracking-tighter uppercase italic leading-none">System <span className="text-brand-green">Overview</span></h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Real-time performance metrics and platform health.</p>
        </div>
        <div className="flex bg-zinc-900 border border-white/10 rounded-2xl p-1 shadow-2xl">
          <button className="px-5 py-2.5 rounded-xl bg-brand-green text-zinc-950 text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-green/20">Last 24h</button>
          <button className="px-5 py-2.5 rounded-xl text-slate-400 text-xs font-black uppercase tracking-widest hover:text-white transition-all">7 Days</button>
          <button className="px-5 py-2.5 rounded-xl text-slate-400 text-xs font-black uppercase tracking-widest hover:text-white transition-all">30 Days</button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 space-y-6 hover:border-white/20 transition-all shadow-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-center relative z-10">
               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner", stat.bg, stat.color)}>
                  <stat.icon size={26} />
               </div>
               <div className={cn("flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-white/5", stat.up ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{stat.trend}</span>
               </div>
            </div>
            <div className="relative z-10">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</div>
               <div className="text-4xl font-black text-white tabular-nums group-hover:text-brand-green transition-colors tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Verification Radar (VISIBLE SHORTCUT) */}
          {pendingGyms.length > 0 && (
            <div className="space-y-8">
              <div className="flex justify-between items-center px-4">
                <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter italic flex items-center">
                  <ShieldCheck size={28} className="mr-3 text-orange-500" />
                  Verification Radar
                </h2>
                <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">HUB ACTIVATION PENDING</span>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-[3.5rem] p-6 shadow-3xl space-y-4">
                {pendingGyms.map((gym: any) => (
                  <div key={gym.id} className="flex justify-between items-center p-6 bg-zinc-950/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 hover:border-orange-500/40 transition-all group">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-orange-500 transition-colors">
                        <Store size={22} />
                      </div>
                      <div>
                        <div className="text-md font-black text-white uppercase tracking-wider">{gym.name}</div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">{gym.location}</div>
                      </div>
                    </div>
                    <Link href="/admin/gyms" className="bg-white text-zinc-950 px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl flex items-center space-x-2">
                       <span>Review Node</span>
                       <MousePointer2 size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Transactions */}
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter italic">Live Transactions</h2>
              <button className="text-brand-green text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-green hover:text-zinc-950 transition-all px-6 py-3 bg-brand-green/10 rounded-2xl border border-brand-green/20">View Journal</button>
            </div>
            <div className="bg-zinc-900/60 border border-white/10 rounded-[3.5rem] p-4 shadow-3xl space-y-3">
              {recentBookings.length > 0 ? recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex justify-between items-center p-6 bg-zinc-950 rounded-[2.5rem] border border-white/5 hover:border-brand-green/30 transition-all group cursor-pointer hover:bg-zinc-900">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center group-hover:bg-brand-green transition-all duration-700 border border-white/5">
                          <Zap size={24} className="text-slate-500 group-hover:text-zinc-950" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-brand-green border-4 border-zinc-950 flex items-center justify-center">
                          <Check size={12} className="text-zinc-950" strokeWidth={5} />
                        </div>
                    </div>
                    <div>
                        <div className="text-md font-black text-white uppercase tracking-wider">{booking.gym.name}</div>
                        <div className="text-sm font-medium text-slate-400 tracking-tight mt-1 flex items-center space-x-2">
                          <span className="truncate max-w-[120px]">{booking.user.email.toLowerCase()}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-800" />
                          <span>{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-white tracking-tight">₹{booking.totalAmount}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5 flex items-center justify-end space-x-1">
                        <ShieldCheck size={12} className="text-brand-green" />
                        <span>SECURED</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-24 text-center text-slate-600 font-bold uppercase tracking-[0.3em] text-xs">
                  <Activity size={48} className="mx-auto mb-6 opacity-20" />
                  <p>No recent platform activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Universal Governance & Quick Actions */}
        <div className="space-y-12">
           <div className="space-y-6">
              <h2 className="text-2xl font-black font-outfit text-white px-4 uppercase tracking-tighter italic">Universal Governance</h2>
              <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-3xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform Comm.</p>
                       <span className="text-xl font-black text-brand-green italic">{commissionRate}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-950 rounded-full border border-white/5">
                       <div className="h-full bg-brand-green shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full" style={{ width: `${commissionRate}%` }} />
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Default Onboarding</p>
                       <span className="text-xl font-black text-orange-500 italic">₹{defaultFee}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] font-black text-slate-700 uppercase tracking-widest pt-1">
                       <Activity size={10} />
                       <span>MODIFIABLE VIA SETTINGS</span>
                    </div>
                 </div>

                 <Link href="/admin/settings" className="block w-full py-4 bg-zinc-950 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center hover:bg-brand-blue hover:text-white transition-all shadow-xl">
                    Configure Registry
                 </Link>
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-2xl font-black font-outfit text-white px-4 uppercase tracking-tighter italic">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "New Blast", icon: Flame, color: "bg-orange-500" },
                   { label: "System Health", icon: Activity, color: "bg-brand-blue" },
                   { label: "KYC Radar", icon: ShieldCheck, color: "bg-brand-green" },
                   { label: "Manage Hubs", icon: Store, color: "bg-purple-500", href: "/admin/gyms" },
                  ].map((action) => (
                    <button key={action.label} className="p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 hover:border-brand-green/30 transition-all active:scale-95 group shadow-2xl hover:bg-zinc-800">
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform", action.color)}>
                          <action.icon size={20} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors text-center">{action.label}</span>
                    </button>
                  ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
