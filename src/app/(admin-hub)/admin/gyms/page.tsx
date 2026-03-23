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
    totalRevenueResult
  ] = await Promise.all([
    prisma.gym.findMany({
      where: { status: GymStatus.PENDING },
      include: { owner: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.gym.findMany({
      where: { 
        status: GymStatus.APPROVED,
        isPaused: false
      },
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
          { status: GymStatus.SUSPENDED },
          { isPaused: true }
        ]
      },
      include: { owner: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.gym.count({ where: { status: GymStatus.APPROVED } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.booking.aggregate({ _sum: { totalAmount: true } })
  ]);

  const totalRevenue = totalRevenueResult._sum.totalAmount || 0;
  // Dynamic commission calculation (15%)
  const revShare = totalRevenue * 0.15;

  const stats = {
    totalGyms: totalGymsCount.toString(),
    activeUsers: userCount > 999 ? `${(userCount / 1000).toFixed(1)}k` : userCount.toString(),
    revShare: `₹${(revShare / 1000).toFixed(1)}k`,
    growth: "+14%", 
    waitTime: pendingGyms.length > 0 ? "1.8 Hours" : "0 Hours",
  };

  return (
    <div className="min-h-screen bg-slate-950/20">
      <GymManagementTabs 
        pendingGyms={pendingGyms}
        activeGyms={activeGyms}
        suspendedGyms={suspendedGyms}
        stats={stats}
      />
    </div>
  );
}
