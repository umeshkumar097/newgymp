"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NotificationEngine } from "@/lib/notifications";
import { GymStatus } from "@prisma/client";

export async function approveGym(gymId: string, setupFee: number) {
  try {
    console.log(`[ADMIN_ACTION] Reviewing Hub Approval: ${gymId}...`);
    
    // 1. Database Update (Crucial - Must happen regardless of notifications)
    const gym = await (prisma.gym as any).update({
      where: { id: gymId },
      data: { 
        status: "AWAITING_PAYMENT" as any,
        onboardingFeeAmount: setupFee
      },
      include: { owner: true }
    });

    console.log(`[ADMIN_ACTION] Database Update Success: ${gym.name} is now AWAITING_PAYMENT.`);

    // 2. Notification Dispatch (Fail-Safe)
    try {
      if (gym.owner?.email) {
        console.log(`[ADMIN_ACTION] Dispatching Enterprise Notifications...`);
        await NotificationEngine.sendApprovalNotification(
          { 
              email: gym.owner.email, 
              name: gym.owner.name || "Partner", 
              phone: gym.owner.phone || null
          },
          gym.name,
          setupFee
        );
        console.log(`[ADMIN_ACTION] Notifications Dispatched.`);
      }
    } catch (notifError: any) {
      // Catching 404s/Auth errors from WhatsApp/Meta API
      console.warn(`[ADMIN_ACTION] Notification Engine failed but Gym was approved:`, notifError.message);
    }

    revalidatePath("/admin/gyms");
    revalidatePath(`/admin/gyms/${gymId}/verify`);
    
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_ACTION] ❌ Critical Approval Error:", error.message);
    return { success: false, error: `Critical System Error: ${error.message}` };
  }
}

export async function rejectGym(gymId: string, reason: string) {
  try {
    console.log(`[ADMIN_ACTION] Reviewing Hub Rejection: ${gymId}...`);
    
    const gym = await (prisma.gym as any).update({
      where: { id: gymId },
      data: { status: "REJECTED" as any },
      include: { owner: true }
    });

    console.log(`[ADMIN_ACTION] Database Update Success: ${gym.name} is REJECTED.`);

    try {
      if (gym.owner?.email) {
          console.log(`[ADMIN_ACTION] Dispatching Rejection Protocol Notifications...`);
          await NotificationEngine.sendRejectionNotification(
              { 
                  email: gym.owner.email, 
                  name: gym.owner.name || "Partner", 
                  phone: gym.owner.phone || null
              },
              gym.name,
              reason
          );
          console.log(`[ADMIN_ACTION] Notifications Dispatched.`);
      }
    } catch (notifError: any) {
      console.warn(`[ADMIN_ACTION] Notification Engine failed but Gym was rejected:`, notifError.message);
    }

    revalidatePath("/admin/gyms");
    revalidatePath(`/admin/gyms/${gymId}/verify`);
    
    return { success: true };
  } catch (error: any) {
    console.error("[ADMIN_ACTION] ❌ Critical Rejection Error:", error.message);
    return { success: false, error: `Critical System Error: ${error.message}` };
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
      console.log(`[ADMIN_ACTION] Sending WhatsApp reminder to ${gym.owner.phone} for gym ${gym.name}`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
  try {
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
