import { TrendingUp, Users, Store, Wallet, ArrowUpRight, ArrowDownRight, Activity, Calendar, Zap, Flame, ShieldCheck, Check, Globe, MousePointer2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { GymStatus } from "@prisma/client";
import Link from "next/link";

export default async function AdminDashboardPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ period?: string }> 
}) {
  const { period = "30d" } = await searchParams;

  // Real DB Queries
  const now = new Date();
  let startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  let prevStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  if (period === "24h") {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    prevStartDate = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  } else if (period === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    prevStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  }

  const [
    totalRevenueResult,
    currentRevenueResult,
    prevRevenueResult,
    userCount,
    currentUserCount,
    prevUserCount,
    gymCount,
    currentGymCount,
    prevGymCount,
    recentBookings,
    openTicketsCount,
    pendingGyms,
    platformSettings
  ] = await Promise.all([
     prisma.booking.aggregate({ _sum: { totalAmount: true } }),
     prisma.booking.aggregate({ 
        where: { createdAt: { gte: startDate } },
        _sum: { totalAmount: true } 
     }),
     prisma.booking.aggregate({ 
        where: { createdAt: { lt: startDate, gte: prevStartDate } },
        _sum: { totalAmount: true } 
     }),
     prisma.user.count({ where: { role: "USER" as any } } as any),
     prisma.user.count({ 
        where: { role: "USER" as any, createdAt: { gte: startDate } } 
     } as any),
     prisma.user.count({ 
        where: { role: "USER" as any, createdAt: { lt: startDate, gte: prevStartDate } } 
     } as any),
     prisma.gym.count({ where: { status: "APPROVED" as any } } as any),
     prisma.gym.count({ 
        where: { status: "APPROVED" as any, createdAt: { gte: startDate } } 
     } as any),
     prisma.gym.count({ 
        where: { status: "APPROVED" as any, createdAt: { lt: startDate, gte: prevStartDate } } 
     } as any),
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
  const currentRevenue = currentRevenueResult._sum.totalAmount || 0;
  const prevRevenue = prevRevenueResult._sum.totalAmount || 0;
  
  const calculateTrend = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? "+100%" : "0%";
    const ratio = ((curr - prev) / prev) * 100;
    return `${ratio >= 0 ? "+" : ""}${ratio.toFixed(1)}%`;
  };

  const revenueTrend = calculateTrend(currentRevenue, prevRevenue);
  const userTrend = calculateTrend(currentUserCount, prevUserCount);
  const gymTrend = calculateTrend(currentGymCount, prevGymCount);

  const commissionRate = platformSettings.find((s: any) => s.key === "COMMISSION_RATE")?.value || "15";
  const defaultFee = platformSettings.find((s: any) => s.key === "DEFAULT_ONBOARDING_FEE")?.value || "4999";

  const stats = [
    { label: "Total Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}k`, trend: revenueTrend, up: currentRevenue >= prevRevenue, icon: Wallet, color: "text-brand-green", bg: "bg-brand-green/10" },
    { label: "Active Users", value: userCount.toString(), trend: userTrend, up: currentUserCount >= prevUserCount, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Partner Hubs", value: gymCount.toString(), trend: gymTrend, up: currentGymCount >= prevGymCount, icon: Store, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Open Tickets", value: openTicketsCount.toString(), trend: openTicketsCount > 0 ? "Urgent" : "Stable", up: openTicketsCount === 0, icon: Activity, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none">Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Real-time performance and health tracking.</p>
        </div>
        <div className="flex bg-white border border-slate-200/60 rounded-2xl p-1 shadow-sm">
          {["24h", "7d", "30d"].map((p) => (
            <Link 
              key={p}
              href={`/admin/dashboard?period=${p}`}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                period === p ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "text-slate-400 hover:text-slate-900"
              )}
            >
              {p === "24h" ? "Last 24h" : p === "7d" ? "7 Days" : "30 Days"}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-white border border-slate-200/60 rounded-[2rem] p-8 space-y-6 hover:border-slate-300 transition-all shadow-sm">
            <div className="flex justify-between items-center relative z-10">
               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm", stat.bg, stat.color)}>
                  <stat.icon size={26} />
               </div>
               <div className={cn("flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-slate-100", stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{stat.trend}</span>
               </div>
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{stat.label}</div>
               <div className="text-4xl font-black text-slate-950 tabular-nums tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Pending Verification */}
          {pendingGyms.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center">
                  <ShieldCheck size={24} className="mr-3 text-orange-500" />
                  Pending Verification
                </h2>
                <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Action Required</span>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-4 shadow-sm space-y-3">
                {pendingGyms.map((gym: any) => (
                  <div key={gym.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-200/40 hover:border-orange-500/40 transition-all group">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
                        <Store size={22} />
                      </div>
                      <div>
                        <div className="text-md font-black text-slate-900 uppercase tracking-wider">{gym.name}</div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{gym.location}</div>
                      </div>
                    </div>
                    <Link href="/admin/gyms" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-md flex items-center space-x-2 border border-slate-800">
                       <span>Review HUB</span>
                       <MousePointer2 size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Recent activity</h2>
              <Link href="/admin/gyms" className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-900 transition-all px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">View Journal</Link>
            </div>
            <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-4 shadow-sm space-y-3">
              {recentBookings.length > 0 ? recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex justify-between items-center p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-brand-green/30 transition-all group cursor-pointer hover:bg-white">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-brand-green/10 transition-all duration-700">
                          <Zap size={24} className="text-slate-400 group-hover:text-brand-green" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-brand-green border-4 border-white flex items-center justify-center">
                          <Check size={12} className="text-slate-950" strokeWidth={5} />
                        </div>
                    </div>
                    <div>
                        <div className="text-md font-black text-slate-900 uppercase tracking-wider">{booking.gym.name}</div>
                        <div className="text-sm font-medium text-slate-500 tracking-tight mt-1 flex items-center space-x-2">
                          <span className="truncate max-w-[120px]">{booking.user.email.toLowerCase()}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span>{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-slate-950 tracking-tight">₹{booking.totalAmount}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5 flex items-center justify-end space-x-1">
                        <ShieldCheck size={12} className="text-brand-green" />
                        <span>VERIFIED</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-24 text-center text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">
                  <Activity size={48} className="mx-auto mb-6 opacity-20 text-slate-300" />
                  <p>No recent platform activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Settings */}
        <div className="space-y-12">
           <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 px-2 uppercase tracking-tighter">Settings</h2>
              <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden group">
                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform Comm.</p>
                       <span className="text-xl font-black text-brand-green">{commissionRate}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full border border-slate-100">
                       <div className="h-full bg-brand-green rounded-full shadow-sm" style={{ width: `${commissionRate}%` }} />
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Default Onboarding</p>
                       <span className="text-xl font-black text-orange-500">₹{defaultFee}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1">
                       <Activity size={10} />
                       <span>MANAGED VIA SYSTEM SETTINGS</span>
                    </div>
                 </div>

                 <Link href="/admin/settings" className="block w-full py-4 bg-slate-950 border border-slate-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] text-center hover:bg-brand-green hover:text-slate-950 transition-all shadow-md">
                    Configure Registry
                 </Link>
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 px-2 uppercase tracking-tighter">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                 {[
                    { label: "Promote", icon: Flame, color: "bg-orange-500" },
                    { label: "Health", icon: Activity, color: "bg-blue-600" },
                    { label: "Security", icon: ShieldCheck, color: "bg-brand-green" },
                    { label: "View HUBs", icon: Store, color: "bg-purple-600", href: "/admin/gyms" },
                  ].map((action) => (
                    <button key={action.label} className="p-8 bg-white border border-slate-200/60 rounded-[2rem] flex flex-col items-center justify-center space-y-4 hover:border-brand-green/30 transition-all active:scale-95 group shadow-sm hover:shadow-md">
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform", action.color)}>
                          <action.icon size={20} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors text-center">{action.label}</span>
                    </button>
                  ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
