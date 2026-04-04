"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function completeUserProfile(data: { phone: string }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findFirst({
      where: { phone: data.phone }
    });

    if (existingUser && existingUser.email !== session.user.email) {
      return { success: false, error: "This phone number is already registered with another account." };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { phone: data.phone }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Profile Completion Error:", error);
    return { success: false, error: error.message };
  }
}
