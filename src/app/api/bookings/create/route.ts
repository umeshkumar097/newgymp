import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const bookingData = await req.json();
    const { 
      gymId, 
      planId, 
      amount, 
      members,
      addons,
      gymName 
    } = bookingData;

    // 1. Get user from session cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Authentication required to book" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User session invalid" }, { status: 401 });
    }

    // 2. Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `BK-${Date.now()}`;

    // 3. Create Booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        gymId: gymId,
        planId: planId,
        bookingDate: new Date(),
        totalAmount: parseFloat(amount),
        status: "BOOKED",
        otp: otp,
        qrCode: `passfit-${bookingId}`,
        members: members || 1,
        selectedAddons: addons || [],
        paymentId: "PAY_AT_GYM",
      },
    });

    // 3. Mark Intent as Converted
    await (prisma as any).bookingIntent.updateMany({
      where: { userId: user.id, gymId, status: "PENDING" },
      data: { status: "CONVERTED" }
    });

    // 4. Send Enhanced WhatsApp Notifications
    try {
      if (user.phone) {
        // Check if first booking
        const previousBookingsCount = await prisma.booking.count({
          where: { userId: user.id, id: { not: booking.id } }
        });

        const planName = planId.includes("day") ? "Day Pass" : 
                         planId.includes("week") ? "Weekly Pass" : 
                         planId.includes("month") ? "Monthly Pass" : "Gym Pass";

        // 4a. Send Official Confirmation
        await NotificationEngine.sendBookingConfirmation(
          { phone: user.phone, name: user.name || "Customer" },
          planName,
          gymName || "PassFit Gym",
          otp
        );

        // 4b. Send Celebration if first booking
        if (previousBookingsCount === 0) {
          await NotificationEngine.sendBookingCelebration(
            { phone: user.phone, name: user.name || "Customer" },
            gymName || "the Gym"
          );
        }
      }
    } catch (wsError) {
      console.error("Failed to send WhatsApp notifications:", wsError);
    }

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
      message: "Booking confirmed successfully" 
    });

  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create booking" 
    }, { status: 500 });
  }
}
