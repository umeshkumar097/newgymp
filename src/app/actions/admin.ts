"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NotificationEngine } from "@/lib/notifications";
import { GymStatus } from "@prisma/client";

export async function approveGym(gymId: string, setupFee: number) {
  try {
    const gym = await (prisma.gym as any).update({
      where: { id: gymId },
      data: { 
        status: "AWAITING_PAYMENT" as any,
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
            phone: gym.owner.phone || null
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

export async function toggleGymPause(gymId: string, isPaused: boolean) {
  try {
    await (prisma.gym as any).update({
      where: { id: gymId },
      data: { isPaused },
    });
    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendDuesReminder(gymId: string) {
  try {
    const gym = await (prisma.gym as any).findUnique({
      where: { id: gymId },
      include: { owner: true }
    });

    if (gym?.owner?.phone) {
      // Mock WhatsApp Send
      console.log(`Sending WhatsApp reminder to ${gym.owner.phone} for gym ${gym.name}`);
      // await NotificationEngine.sendDuesReminder(gym.owner.phone, gym.name);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectGym(gymId: string) {
  try {
    await (prisma.gym as any).update({
      where: { id: gymId },
      data: { status: "REJECTED" as any },
    });
    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete related records first if needed, though Prisma cascade should handle it if configured
    // For now, simple delete
    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    console.error("User Deletion Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getPlatformSettings() {
  try {
    return await (prisma as any).platformSetting.findMany();
  } catch (error: any) {
    return [];
  }
}

export async function updatePlatformSetting(key: string, value: string) {
  try {
    await (prisma as any).platformSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return { success: false, error: error.message };
  }
}
