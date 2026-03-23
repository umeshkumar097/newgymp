import React from "react";
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  const [revenue, userCount, bookingCount, recentBookings] = await Promise.all([
    prisma.booking.aggregate({ _sum: { totalAmount: true } }),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: true, gym: true }
    })
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 h-[400px] flex items-center justify-center text-zinc-700 text-[10px] font-black uppercase tracking-[1em]">
          Revenue Graph Placeholder
        </div>
        <div className="p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 h-[400px] flex items-center justify-center text-zinc-700 text-[10px] font-black uppercase tracking-[1em] text-center">
          Market Share Chart
        </div>
      </div>
    </div>
  );
}
