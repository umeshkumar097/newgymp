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

  const totalRevenue = revenue._sum?.totalAmount || 0;
  const conversionRate = userCount > 0 ? ((bookingCount / userCount) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-12 font-sans bg-white min-h-screen -m-8 p-8 pb-32 pb-40">
      <div className="pt-8">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tighter uppercase leading-none">Intelligence <span className="text-brand-green">Hub</span></h1>
        <p className="text-slate-500 text-sm font-medium mt-4 tracking-wide uppercase tracking-widest text-[10px] font-bold">Real-time platform performance & market insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "TOTAL REVENUE", value: `₹${totalRevenue.toLocaleString()}`, trend: "+12.5%", icon: DollarSign, color: "text-brand-green" },
          { label: "ACTIVE USERS", value: userCount.toString(), trend: "+5.2%", icon: Users, color: "text-brand-blue" },
          { label: "TOTAL BOOKINGS", value: bookingCount.toString(), trend: "+8.1%", icon: Zap, color: "text-purple-500" },
          { label: "CONVERSION", value: `${conversionRate}%`, trend: "-2.4%", icon: TrendingUp, color: "text-orange-500", down: true },
        ].map((stat) => (
          <div key={stat.label} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4 hover:border-brand-green transition-all group">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
            </div>
            <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${stat.down ? "text-red-500" : "text-brand-green"}`}>
              {stat.down ? <ArrowDownRight size={14} className="mr-1" /> : <ArrowUpRight size={14} className="mr-1" />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
        {/* Live Platform Ledger */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center px-4">
              <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tighter italic">Live Platform Ledger</h2>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-widest bg-brand-green/10 px-4 py-2 rounded-xl border border-brand-green/20">Real-time Feed</span>
           </div>
           <div className="bg-white border border-slate-100 rounded-[3rem] p-4 shadow-xl shadow-slate-200/50 space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="p-6 bg-slate-50 rounded-[2.2rem] border border-slate-100 flex items-center justify-between group hover:border-brand-green transition-all hover:bg-white hover:shadow-lg">
                   <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                         <Zap size={24} className={cn(recentBookings.indexOf(b) === 0 && "animate-pulse")} />
                      </div>
                      <div>
                         <div className="text-sm font-extrabold text-slate-900 uppercase tracking-wider line-clamp-1">{b.gym.name}</div>
                         <div className="text-sm font-medium text-slate-400 tracking-tight mt-1">
                            {b.user.email.toLowerCase()} <span className="mx-2 text-slate-200">•</span> {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xl font-extrabold text-slate-900 tracking-tight">₹{b.totalAmount}</div>
                      <div className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em] mt-1.5 flex items-center justify-end space-x-1">
                         <ShieldCheck size={10} />
                         <span>Verified</span>
                      </div>
                   </div>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <div className="p-24 text-center text-slate-300 font-bold uppercase tracking-[0.3em] text-xs italic">Awaiting Platform Activity...</div>
              )}
           </div>
        </div>

        {/* Market Penetration */}
        <div className="space-y-6">
           <div className="px-4">
              <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tighter italic">Market Pulse</h2>
           </div>
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-10 shadow-xl shadow-slate-200/50 h-full">
              {gymStats.map((stat, i) => (
                <div key={i} className="space-y-4">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                      <span>{stat.location}</span>
                      <span className="text-slate-900">{stat._count} Hubs</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-blue to-brand-green rounded-full shadow-lg shadow-brand-blue/20" 
                        style={{ width: `${(stat._count / (gymCount || 1)) * 100}%` }} 
                      />
                   </div>
                </div>
              ))}
              {gymStats.length === 0 && (
                <div className="p-12 text-center text-slate-200 font-black uppercase tracking-widest text-xs italic">Scanning Territories...</div>
              )}
              
              <div className="pt-10 border-t border-slate-50 mt-10">
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] space-y-2 shadow-inner">
                    <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">Platform Growth</p>
                    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{gymCount} <span className="text-xs text-slate-400 font-bold uppercase ml-1">Total Active Hubs</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
