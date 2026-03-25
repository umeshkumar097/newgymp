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

export async function rejectGym(gymId: string, reason: string) {
  try {
    const gym = await (prisma.gym as any).update({
      where: { id: gymId },
      data: { status: "REJECTED" as any },
      include: { owner: true }
    });

    if (gym.owner?.email) {
        await NotificationEngine.sendRejectionNotification(
            { 
                email: gym.owner.email, 
                name: gym.owner.name || "Partner", 
                phone: gym.owner.phone || null
            },
            gym.name,
            reason
        );
    }

    revalidatePath("/admin/gyms");
    return { success: true };
  } catch (error: any) {
    console.error("Rejection Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Using deleteMany to avoid "Record to delete does not exist" errors
    // and ensuring we only target the specific user
    const result = await prisma.user.deleteMany({
      where: { id: userId }
    });
    
    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
    
    return { 
      success: true, 
      count: result.count,
      message: result.count > 0 ? "User deleted successfully" : "User already deleted"
    };
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
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/gyms");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return { success: false, error: error.message };
  }
}

export async function nudgeIntent(intentId: string) {
  try {
    const intent = await (prisma as any).bookingIntent.findUnique({
      where: { id: intentId },
      include: { user: true, gym: true }
    });

    if (!intent || !intent.user?.email) throw new Error("Intent or User not found");

    const bookingUrl = `https://passfit.in/gyms/${intent.gymId}`;

    await NotificationEngine.sendAbandonedBookingNudge(
      { 
        email: intent.user.email, 
        name: intent.user.name || "Customer", 
        phone: intent.user.phone || null
      },
      intent.gym.name,
      bookingUrl
    );

    await (prisma as any).bookingIntent.update({
      where: { id: intentId },
      data: { status: "RECOVERED" as any }
    });

    revalidatePath("/admin/intents");
    return { success: true };
  } catch (error: any) {
    console.error("Nudge Error:", error);
    return { success: false, error: error.message };
  }
}
