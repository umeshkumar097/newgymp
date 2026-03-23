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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-outfit text-white tracking-tight uppercase">System Overview</h1>
          <p className="text-zinc-500 text-sm font-medium">Real-time performance metrics and platform health.</p>
        </div>
        <div className="flex bg-zinc-900 border border-white/5 rounded-2xl p-1 shadow-inner">
          <button className="px-4 py-2 rounded-xl bg-brand-green text-[#0F172A] text-xs font-bold uppercase tracking-widest shadow-lg">Last 24h</button>
          <button className="px-4 py-2 rounded-xl text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">7 Days</button>
          <button className="px-4 py-2 rounded-xl text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">30 Days</button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 space-y-6 hover:border-white/10 transition-all hover:bg-zinc-900 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-center relative z-10">
               <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5", stat.bg, stat.color)}>
                  <stat.icon size={24} />
               </div>
               <div className={cn("flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg", stat.up ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span>{stat.trend}</span>
               </div>
            </div>
            <div className="relative z-10">
               <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</div>
               <div className="text-3xl font-black text-white tabular-nums group-hover:text-brand-green transition-colors">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold font-outfit text-white uppercase tracking-tight">Live Transactions</h2>
            <button className="text-brand-green text-[10px] font-black uppercase tracking-widest hover:underline px-4 py-2 bg-brand-green/10 rounded-xl">View Journal</button>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-[3rem] p-4 shadow-2xl">
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-5 hover:bg-white/5 rounded-[2rem] transition-all group cursor-pointer border-b last:border-0 border-white/5">
                <div className="flex items-center space-x-5">
                   <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-brand-green transition-all duration-500 border border-white/5">
                         <Zap size={20} className="text-zinc-500 group-hover:text-[#0F172A]" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-brand-green border-4 border-zinc-900 flex items-center justify-center">
                         <Check size={10} className="text-[#0F172A]" strokeWidth={4} />
                      </div>
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">Pass Booking</div>
                      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">
                        {booking.gym.name} • {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-lg font-black text-white">₹{booking.totalAmount}</div>
                   <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">ID: {booking.id.substring(0, 8).toUpperCase()}</div>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center opacity-20">
                <Activity size={48} className="mx-auto mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">No recent transactions</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Platform Health */}
        <div className="space-y-8">
           <div className="space-y-4">
              <h2 className="text-xl font-bold font-outfit text-white px-2 uppercase tracking-tight">Platform Health</h2>
              <div className="bg-zinc-900/50 border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500 px-1">
                       <span>Database Sync</span>
                       <span className="text-brand-green">Healthy</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full w-[99%] bg-brand-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500 px-1">
                       <span>API Response Time</span>
                       <span className="text-orange-500">124ms</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden shadow-inner flex space-x-1 p-0.5">
                       {[...Array(20)].map((_, i) => (
                          <div key={i} className={cn("h-full flex-1 rounded-sm", i < 15 ? "bg-orange-500/80" : i < 18 ? "bg-orange-500/40" : "bg-zinc-700")} />
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h2 className="text-xl font-bold font-outfit text-white px-2 uppercase tracking-tight">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "New Blast", icon: Flame, color: "bg-orange-500" },
                   { label: "Reports", icon: Calendar, color: "bg-brand-blue" },
                   { label: "KYC Check", icon: ShieldCheck, color: "bg-brand-green" },
                   { label: "Verify All", icon: Check, color: "bg-purple-500" },
                  ].map((action) => (
                    <button key={action.label} className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl flex flex-col items-center justify-center space-y-3 hover:bg-zinc-800 transition-all active:scale-95 group">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform", action.color)}>
                          <action.icon size={18} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                  ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
