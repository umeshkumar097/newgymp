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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gym Moderation</h1>
          <p className="text-slate-500 text-sm font-medium">Verify, manage, and monitor all platform partner hubs.</p>
        </div>
         
        <div className="flex items-center space-x-6 bg-white border border-slate-200/60 rounded-[2.5rem] px-10 py-6 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Revenue</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">₹{(totalRevenue / 1000).toFixed(1)}k</p>
            </div>
            <div className="w-[1px] h-10 bg-slate-100" />
            <div className="flex items-center space-x-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
               <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
               <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em]">Live Registry</span>
            </div>
        </div>
      </div>

      {/* Main Tabs Component */}
      <GymManagementTabs 
        pendingGyms={pendingGyms}
        activeGyms={activeGyms}
        suspendedGyms={suspendedGyms}
        stats={stats}
        commissionRate={commissionRate}
        defaultOnboardingFee={defaultOnboardingFee}
      />
    </div>
  );
}
