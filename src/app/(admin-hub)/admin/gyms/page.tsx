import React from "react";
import { prisma } from "@/lib/prisma";
import { GymManagementTabs } from "@/components/admin/GymManagementTabs";
import { GymStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminGymsPage() {
  const [
    pendingGyms,
    activeGyms,
    suspendedGyms,
    totalGymsCount,
    userCount,
    totalRevenueResult,
    platformSettings
  ] = await Promise.all([
    prisma.gym.findMany({
      where: { 
        status: { 
          in: [
            GymStatus.PENDING, 
            "AWAITING_PAYMENT" as any, 
            "REJECTED" as any
          ] 
        } 
      },
      include: { owner: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.gym.findMany({
      where: { 
        status: "APPROVED" as any,
        isPaused: false as any
      } as any,
      include: { 
        owner: true, 
        bookings: { select: { totalAmount: true } },
        _count: { select: { bookings: true } } 
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.gym.findMany({
      where: { 
        OR: [
          { status: "SUSPENDED" as any },
          { isPaused: true as any }
        ]
      } as any,
      include: { owner: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.gym.count({ where: { status: "APPROVED" as any } } as any),
    prisma.user.count({ where: { role: "USER" as any } } as any),
    prisma.booking.aggregate({ _sum: { totalAmount: true } }),
    (prisma as any).platformSetting.findMany({
      where: {
        key: { in: ["COMMISSION_RATE", "DEFAULT_ONBOARDING_FEE"] }
      }
    })
  ]);

  const commissionSetting = platformSettings.find((s: any) => s.key === "COMMISSION_RATE");
  const feeSetting = platformSettings.find((s: any) => s.key === "DEFAULT_ONBOARDING_FEE");

  const commissionRate = commissionSetting ? parseFloat(commissionSetting.value) : 15.0;
  const defaultOnboardingFee = feeSetting ? parseFloat(feeSetting.value) : 4999.0;

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
  const revShare = totalRevenue * (commissionRate / 100);

  const stats = {
    totalGyms: totalGymsCount.toString(),
    activeUsers: userCount > 999 ? `${(userCount / 1000).toFixed(1)}k` : userCount.toString(),
    revShare: `₹${(revShare / 1000).toFixed(1)}k`,
    growth: "+14%", 
    waitTime: pendingGyms.length > 0 ? "1.8 Hours" : "0 Hours",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8 space-y-12 selection:bg-brand-green/20">
      
      {/* Decorative Brand Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end space-y-6 md:space-y-0">
         <div className="space-y-2">
            <div className="flex items-center space-x-3 text-slate-400">
               <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">ADMIN HUB v4.5</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
               Gym <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Moderation</span>
            </h1>
         </div>
         
         <div className="flex items-center space-x-6 bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 shadow-sm">
             <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Master Ledger</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">₹{(totalRevenue / 1000).toFixed(1)}k</p>
             </div>
            <div className="w-[1px] h-10 bg-slate-200" />
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
               <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">Live Sync</span>
            </div>
         </div>
      </div>

      <GymManagementTabs 
        pendingGyms={pendingGyms}
        activeGyms={activeGyms}
        suspendedGyms={suspendedGyms}
        stats={stats}
        commissionRate={commissionRate}
        defaultOnboardingFee={defaultOnboardingFee}
      />
      
      <div className="pt-20 pb-10 text-center opacity-20">
         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.8em]">PassFit Global Control Port • Enterprise Secure</p>
      </div>
    </div>
  );
}
