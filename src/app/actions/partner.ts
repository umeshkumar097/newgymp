"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyBooking(otp: string, gymId: string) {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        otp,
        gymId,
        status: "BOOKED",
      },
    });

    if (!booking) {
      return { success: false, error: "Invalid OTP or Booking not found" };
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CHECKED_IN" },
    });

    revalidatePath("/partner/dashboard");
    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
