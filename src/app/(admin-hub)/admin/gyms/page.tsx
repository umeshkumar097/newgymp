import React from "react";
import { prisma } from "@/lib/prisma";
import { GymManagementTabs } from "@/components/admin/GymManagementTabs";
import { GymStatus } from "@prisma/client";

export default async function AdminGymsPage() {
  const pendingGyms = await prisma.gym.findMany({
    where: { status: GymStatus.PENDING },
    include: { owner: true },
    orderBy: { createdAt: "desc" }
  });

  const activeGyms = await prisma.gym.findMany({
    where: { 
      status: GymStatus.APPROVED,
      isPaused: false
    },
    include: { owner: true, _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" }
  });

  const suspendedGyms = await prisma.gym.findMany({
    where: { 
      OR: [
        { status: GymStatus.SUSPENDED },
        { isPaused: true }
      ]
    },
    include: { owner: true },
    orderBy: { updatedAt: "desc" }
  });

  const stats = {
    totalGyms: "48",
    activeUsers: "1.2k",
    revShare: "₹45k",
    growth: "24%",
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
