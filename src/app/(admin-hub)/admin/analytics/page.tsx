import React from "react";
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Zap, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
// ... existing code ...
  // ... (fetch logic remains same)
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
    <div className="space-y-12 font-outfit bg-[#0B0F19] min-h-screen -m-8 p-8">
      <div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">Intelligence <span className="text-brand-green">Hub</span></h1>
        <p className="text-slate-400 text-sm font-medium mt-4 tracking-wide">Real-time platform performance & market insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "TOTAL REVENUE", value: `₹${totalRevenue.toLocaleString()}`, trend: "+12.5%", icon: DollarSign, color: "text-brand-green" },
          { label: "ACTIVE USERS", value: userCount.toString(), trend: "+5.2%", icon: Users, color: "text-brand-blue" },
          { label: "TOTAL BOOKINGS", value: bookingCount.toString(), trend: "+8.1%", icon: Zap, color: "text-purple-500" },
          { label: "CONVERSION", value: `${conversionRate}%`, trend: "-2.4%", icon: TrendingUp, color: "text-orange-500", down: true },
        ].map((stat) => (
          <div key={stat.label} className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl space-y-4 hover:border-white/20 transition-all group">
            <div className={`w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</div>
              <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
            </div>
            <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${stat.down ? "text-red-500" : "text-brand-green"}`}>
              {stat.down ? <ArrowDownRight size={14} className="mr-1" /> : <ArrowUpRight size={14} className="mr-1" />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        {/* Live Platform Ledger */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center px-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Live Platform Ledger</h2>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-widest bg-brand-green/10 px-4 py-2 rounded-xl border border-brand-green/20">Real-time Feed</span>
           </div>
           <div className="bg-zinc-900/60 border border-white/10 rounded-[3rem] p-4 shadow-3xl space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-6 bg-zinc-950 rounded-[2.2rem] border border-white/5 flex items-center justify-between group hover:border-brand-green/40 transition-all hover:bg-zinc-900">
                   <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-brand-green group-hover:text-zinc-950 transition-all duration-500">
                         <Zap size={24} className={cn(recentBookings.indexOf(b) === 0 && "animate-pulse")} />
                      </div>
                      <div>
                         <div className="text-sm font-black text-white uppercase tracking-wider line-clamp-1">{b.gym.name}</div>
                         <div className="text-sm font-medium text-slate-400 tracking-tight mt-1">
                            {b.user.email.toLowerCase()} <span className="mx-2 text-zinc-800">•</span> {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xl font-black text-white tracking-tight">₹{b.totalAmount}</div>
                      <div className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em] mt-1.5 flex items-center justify-end space-x-1">
                         <ShieldCheck size={10} />
                         <span>Verified</span>
                      </div>
                   </div>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <div className="p-24 text-center text-slate-500 font-bold uppercase tracking-[0.3em] text-xs italic">Awaiting Platform Activity...</div>
              )}
           </div>
        </div>

        {/* Market Penetration */}
        <div className="space-y-6">
           <div className="px-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Market Pulse</h2>
           </div>
           <div className="bg-zinc-900 border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-3xl h-full">
              {gymStats.map((stat, i) => (
                <div key={i} className="space-y-4">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                      <span>{stat.location}</span>
                      <span className="text-white">{stat._count} Hubs</span>
                   </div>
                   <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-blue to-brand-green rounded-full shadow-lg shadow-brand-blue/20" 
                        style={{ width: `${(stat._count / (gymCount || 1)) * 100}%` }} 
                      />
                   </div>
                </div>
              ))}
              {gymStats.length === 0 && (
                <div className="p-12 text-center text-slate-600 font-black uppercase tracking-widest text-xs italic">Scanning Territories...</div>
              )}
              
              <div className="pt-10 border-t border-white/5 mt-10">
                 <div className="bg-brand-green/5 border border-brand-green/20 p-6 rounded-[2rem] space-y-2">
                    <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">Platform Growth</p>
                    <p className="text-2xl font-black text-white tracking-tight">{gymCount} <span className="text-xs text-slate-400 font-bold uppercase ml-1">Total Active Hubs</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
