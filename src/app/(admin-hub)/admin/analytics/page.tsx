import React from "react";
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Zap, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const [revenue, userCount, bookingCount, recentBookings, gymStats, gymCount] = await Promise.all([
    prisma.booking.aggregate({ _sum: { totalAmount: true } }),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: true, gym: true }
    }),
    prisma.gym.groupBy({
      by: ['location'],
      _count: true,
      orderBy: {
        _count: {
          location: 'desc'
        }
      },
      take: 5
    }),
    prisma.gym.count()
  ]);

  const totalRevenue = revenue._sum?.totalAmount || 0;
  const conversionRate = userCount > 0 ? ((bookingCount / userCount) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Analytics Hub</h1>
          <p className="text-slate-500 text-sm font-medium">Real-time platform performance and member insights.</p>
        </div>
        <div className="flex items-center space-x-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
           <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em]">Real-time Feed</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "+12.5%", icon: DollarSign, color: "text-brand-green", bg: "bg-green-50/50" },
          { label: "Active Users", value: userCount.toString(), trend: "+5.2%", icon: Users, color: "text-brand-blue", bg: "bg-blue-50/50" },
          { label: "Total Bookings", value: bookingCount.toString(), trend: "+8.1%", icon: Zap, color: "text-purple-500", bg: "bg-purple-50/50" },
          { label: "Conversion", value: `${conversionRate}%`, trend: "-2.4%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50/50", down: true },
        ].map((stat) => (
          <div key={stat.label} className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm space-y-4 hover:border-slate-300 transition-all group">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center border border-slate-100 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">{stat.label}</div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            </div>
            <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${stat.down ? "text-red-500" : "text-brand-green"}`}>
              {stat.down ? <ArrowDownRight size={14} className="mr-1" /> : <ArrowUpRight size={14} className="mr-1" />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Tables/Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4">
        {/* Recent Ledger */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter ml-4">Platform Activity</h2>
           <div className="bg-white border border-slate-200/60 rounded-[3rem] p-4 shadow-sm space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                   <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-200 group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                         <Zap size={20} />
                      </div>
                      <div>
                         <div className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">{b.gym.name}</div>
                         <div className="text-[11px] font-medium text-slate-400 tracking-tight mt-0.5">
                            {b.user.email} <span className="mx-2 text-slate-200">•</span> {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xl font-black text-brand-green tracking-tight">₹{b.totalAmount}</div>
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 flex items-center justify-end space-x-1">
                         <ShieldCheck size={10} />
                         <span>Secured</span>
                      </div>
                   </div>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <div className="p-24 text-center text-slate-200 font-black uppercase tracking-widest text-xs">Waiting for events...</div>
              )}
           </div>
        </div>

        {/* Market Penetration */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter ml-4">Market Focus</h2>
           <div className="bg-white border border-slate-200/60 rounded-[3rem] p-10 space-y-10 shadow-sm h-full">
              {gymStats.map((stat, i) => (
                <div key={i} className="space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                      <span>{stat.location}</span>
                      <span className="text-slate-900">{stat._count} Hubs</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-green rounded-full shadow-sm" 
                        style={{ width: `${(stat._count / (gymCount || 1)) * 100}%` }} 
                      />
                   </div>
                </div>
              ))}
              <div className="pt-10 border-t border-slate-50 mt-10">
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-1 shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Footprint</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{gymCount} <span className="text-[10px] text-brand-green font-black uppercase ml-1">Total Hubs</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
