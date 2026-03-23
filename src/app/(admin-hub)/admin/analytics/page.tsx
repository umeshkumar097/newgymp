import React from "react";
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";

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

  const totalRevenue = revenue._sum.totalAmount || 0;
  const conversionRate = userCount > 0 ? ((bookingCount / userCount) * 100).toFixed(1) : "0";
  return (
    <div className="space-y-10 font-outfit">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Intelligence Hub</h1>
        <p className="text-zinc-500 text-sm font-medium mt-2">Real-time data visualization of PassFit platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "+12.5%", icon: DollarSign, color: "text-brand-green" },
          { label: "Active Users", value: userCount.toString(), trend: "+5.2%", icon: Users, color: "text-brand-blue" },
          { label: "Bookings", value: bookingCount.toString(), trend: "+8.1%", icon: Zap, color: "text-purple-500" },
          { label: "Conversion", value: `${conversionRate}%`, trend: "-2.4%", icon: TrendingUp, color: "text-orange-500", down: true },
        ].map((stat) => (
          <div key={stat.label} className="p-8 rounded-[2.5rem] bg-zinc-900/60 border border-white/5 space-y-4">
            <div className={`w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-white/5 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-white tracking-tight">{stat.value}</div>
            </div>
            <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${stat.down ? "text-red-500" : "text-brand-green"}`}>
              {stat.down ? <ArrowDownRight size={14} className="mr-1" /> : <ArrowUpRight size={14} className="mr-1" />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Platform Ledger */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center px-4">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Live Platform Ledger</h2>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-widest bg-brand-green/10 px-3 py-1 rounded-lg">Real-time Feed</span>
           </div>
           <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-4 shadow-2xl space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-6 bg-zinc-950/50 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-brand-green/30 transition-all">
                   <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-brand-green transition-colors">
                         <Zap size={20} />
                      </div>
                      <div>
                         <div className="text-xs font-black text-white uppercase tracking-widest line-clamp-1">{b.gym.name}</div>
                         <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{b.user.email} • {new Date(b.createdAt).toLocaleTimeString()}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-md font-black text-white">₹{b.totalAmount}</div>
                      <div className="text-[8px] font-black text-brand-green uppercase tracking-widest mt-1">Verified</div>
                   </div>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <div className="p-20 text-center text-zinc-800 font-black uppercase tracking-widest text-sm">No recent activity</div>
              )}
           </div>
        </div>

        {/* Market Penetration */}
        <div className="space-y-6">
           <div className="px-4">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Market Pulse</h2>
           </div>
           <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl">
              {gymStats.map((stat, i) => (
                <div key={i} className="space-y-3">
                   <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500 px-1">
                      <span>{stat.location}</span>
                      <span className="text-white">{stat._count} Hubs</span>
                   </div>
                   <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-blue rounded-full" 
                        style={{ width: `${(stat._count / (gymCount || 1)) * 100}%` }} 
                      />
                   </div>
                </div>
              ))}
              {gymStats.length === 0 && (
                <div className="p-10 text-center text-zinc-800 font-black uppercase tracking-widest text-xs italic">Awaiting Hub Data...</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
