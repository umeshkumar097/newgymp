"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveGym(gymId: string) {
  try {
    await prisma.gym.update({
      where: { id: gymId },
      data: { status: "APPROVED" },
    });
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
