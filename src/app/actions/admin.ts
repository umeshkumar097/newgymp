"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NotificationEngine } from "@/lib/notifications";

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

    // Send Real Welcome Notification (Email + WhatsApp)
    if (gym.owner?.email) {
      await NotificationEngine.sendApprovalNotification(
        { 
            email: gym.owner.email, 
            name: gym.owner.name || "Partner", 
            phone: gym.owner.phone 
        },
        gym.name,
        setupFee
      );
    }

    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    console.error("Approval Error:", error);
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
