import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GymVerificationProtocol } from "@/components/admin/GymVerificationProtocol";

interface VerifyPageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyGymPage({ params }: VerifyPageProps) {
  const { id } = await params;

  const gym = await (prisma.gym as any).findUnique({
    where: { id },
    include: {
      owner: true,
      bookings: true,
    },
  });

  if (!gym) {
    return notFound();
  }

  // Get default onboarding fee from platform settings or use static default
  const settings = await (prisma as any).platformSetting.findUnique({
    where: { key: "DEFAULT_ONBOARDING_FEE" }
  });
  
  const defaultOnboardingFee = settings ? parseInt(settings.value) : 4999;

  return (
    <div className="min-h-screen bg-slate-50">
      <GymVerificationProtocol 
        gym={JSON.parse(JSON.stringify(gym))} 
        defaultOnboardingFee={defaultOnboardingFee}
      />
    </div>
  );
}
