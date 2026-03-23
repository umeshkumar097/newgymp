import React from "react";
import { prisma } from "@/lib/prisma";
import { GymManagementTabs } from "@/components/admin/GymManagementTabs";
import { GymStatus } from "@prisma/client";

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
      where: { status: GymStatus.PENDING },
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
    <div className="bg-[#0B0F19] min-h-screen -m-8 p-8">
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
