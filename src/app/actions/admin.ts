"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveGym(gymId: string, setupFee: number) {
  try {
    const gym = await prisma.gym.update({
      where: { id: gymId },
      data: { 
        status: "AWAITING_PAYMENT",
        onboardingFeeAmount: setupFee
      },
      include: { owner: true }
    });

    // Simulate sending Welcome Email with Agreement
    console.log(`[EMAIL SIMULATOR] Sending to: ${gym.owner.email}`);
    console.log(`Subject: Welcome to PassFit! Your Partner Agreement is Approved.`);
    console.log(`Body: Hello ${gym.owner.name}, Your gym "${gym.name}" is approved. 
      Please pay the setup fee of ₹${setupFee} to activate the 90-day 0% commission period. 
      Signed Agreement attached: MoU_${gym.id}.pdf`);

    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectGym(gymId: string) {
  try {
    await prisma.gym.update({
      where: { id: gymId },
      data: { status: "REJECTED" },
    });
    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
