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
    settings
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
    (prisma as any).platformSetting.findUnique({ where: { key: "COMMISSION_RATE" } })
  ]);

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
  // Dynamic commission calculation from settings
  const commissionRate = settings ? parseFloat(settings.value) : 15.0;
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
      />
    </div>
  );
}
