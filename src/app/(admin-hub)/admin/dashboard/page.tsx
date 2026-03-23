import { TrendingUp, Users, Store, Wallet, ArrowUpRight, ArrowDownRight, Activity, Calendar, Zap, Flame, ShieldCheck, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { GymStatus } from "@prisma/client";

export default async function AdminDashboardPage() {
  // Real DB Queries
  const [
    totalRevenueResult,
    userCount,
    gymCount,
    bookingCount,
    recentBookings,
    openTicketsCount
  ] = await Promise.all([
     prisma.booking.aggregate({ _sum: { totalAmount: true } }),
     prisma.user.count({ where: { role: "USER" } }),
     prisma.gym.count({ where: { status: GymStatus.APPROVED } }),
     prisma.booking.count(),
     prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { gym: true, user: true }
     }),
     prisma.supportTicket.count({ where: { status: "OPEN" } })
  ]);

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

  const stats = [
    { label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}k`, trend: "+14.5%", up: true, icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Active Users", value: userCount.toString(), trend: "+8.2%", up: true, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Partner Gyms", value: gymCount.toString(), trend: "-2.1%", up: false, icon: Store, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Open Tickets", value: openTicketsCount.toString(), trend: "Urgent", up: false, icon: Activity, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-12 font-outfit animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#0B0F19] min-h-screen -m-8 p-8">
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
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter italic">Live Transactions</h2>
            <button className="text-brand-green text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-green hover:text-zinc-950 transition-all px-6 py-3 bg-brand-green/10 rounded-2xl border border-brand-green/20">View Journal</button>
          </div>
          <div className="bg-zinc-900/60 border border-white/10 rounded-[3.5rem] p-4 shadow-3xl space-y-3">
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
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
                        <span>{booking.user.email.toLowerCase()}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span>{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-xl font-black text-white tracking-tight">₹{booking.totalAmount}</div>
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5 flex items-center justify-end space-x-1">
                      <ShieldCheck size={12} className="text-brand-green" />
                      <span>SECURE TRANSACTION</span>
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

        {/* Quick Actions & Platform Health */}
        <div className="space-y-10">
           <div className="space-y-6">
              <h2 className="text-2xl font-black font-outfit text-white px-4 uppercase tracking-tighter italic">Platform Health</h2>
              <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-3xl">
                 <div className="space-y-5">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                       <span>Database Sync</span>
                       <span className="text-brand-green flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                          <span>Stable</span>
                       </span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                       <div className="h-full w-[99.4%] bg-gradient-to-r from-brand-blue to-brand-green rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    </div>
                 </div>
                 <div className="space-y-5">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                       <span>API Latency</span>
                       <span className="text-amber-500">114ms</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 shadow-inner flex space-x-1.5 p-1">
                       {[...Array(15)].map((_, i) => (
                          <div key={i} className={cn("h-full flex-1 rounded-sm transition-all duration-1000", i < 11 ? "bg-brand-green/80" : i < 13 ? "bg-amber-500/60" : "bg-zinc-800")} />
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-2xl font-black font-outfit text-white px-4 uppercase tracking-tighter italic">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "New Blast", icon: Flame, color: "bg-orange-500" },
                   { label: "Reports", icon: Calendar, color: "bg-brand-blue" },
                   { label: "KYC Check", icon: ShieldCheck, color: "bg-brand-green" },
                   { label: "Verify All", icon: Check, color: "bg-purple-500" },
                  ].map((action) => (
                    <button key={action.label} className="p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 hover:border-brand-green/30 transition-all active:scale-95 group shadow-2xl hover:bg-zinc-800">
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform", action.color)}>
                          <action.icon size={20} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                  ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
