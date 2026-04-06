import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { cookies } from "next/headers";

/**
 * HYBRID BOOKING CREATION API
 * Supports: 1. NextAuth (Web Sessions)
 *           2. Manual Cookies (Mobile/Unified Auth)
 */

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

    let userId: string | null = null;
    let userName: string | null | undefined = null;
    let userEmail: string | null | undefined = null;
    let userPhone: string | null | undefined = null;

    // 1. Attempt to Get Identity from NextAuth Session
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      userId = (session.user as any).id;
      userName = session.user.name;
      userEmail = session.user.email;
      userPhone = (session.user as any).phone;
    }

    // 2. Fallback to user_id Cookie (Mobile/Hybrid)
    if (!userId) {
      const cookieStore = await cookies();
      const cookieUserId = cookieStore.get("user_id")?.value;
      
      if (cookieUserId) {
        const user = await prisma.user.findUnique({
          where: { id: cookieUserId },
          select: { id: true, name: true, email: true, phone: true }
        });
        
        if (user) {
          userId = user.id;
          userName = user.name;
          userEmail = user.email;
          userPhone = user.phone;
        }
      }
    }

    // 3. Reject if still no identity
    if (!userId) {
      return NextResponse.json({ error: "Authentication required to create booking" }, { status: 401 });
    }

    // 4. Generate OTP & Booking Details
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const cleanBookingDates = (bookingData.bookingDates || [new Date()]).map((d: string) => new Date(d));

    // 5. Create Booking (Multi-Date Support)
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        gymId: gymId,
        planId: planId,
        bookingDates: cleanBookingDates,
        totalAmount: parseFloat(amount),
        status: "BOOKED",
        otp: otp,
        qrCode: `passfit-${Date.now()}`,
        members: members || 1,
        selectedAddons: addons || [],
        paymentId: "PAY_AT_GYM",
      },
      include: {
        gym: {
          include: {
            owner: true
          }
        },
        plan: true
      }
    });

    // 6. Send Operational & Financial Notifications (Dual Trigger)
    try {
      // Alert Gym Owner with Manifest
      if (booking.gym.owner?.email) {
        await NotificationEngine.sendBookingAlertToOwner({
          owner: { email: booking.gym.owner.email, name: booking.gym.owner.name || "Partner" },
          customer: { 
            name: (userName ?? "Member"), 
            phone: (userPhone ?? null), 
            email: (userEmail ?? "member@passfit.in") 
          },
          gymName: booking.gym.name,
          planName: booking.plan.type,
          amount: booking.totalAmount,
          dates: cleanBookingDates,
          members: booking.members
        });
      }

      // Send Professional Invoice to User (Aiclex Technologies Branding)
      if (userEmail) {
        await NotificationEngine.sendBookingInvoice({
          user: { 
            email: userEmail, 
            name: (userName ?? "Member"), 
            phone: (userPhone ?? null) 
          },
          bookingId: booking.id,
          gymName: booking.gym.name,
          amount: booking.totalAmount,
          dates: cleanBookingDates,
          members: booking.members
        });
      }
    } catch (notificationError) {
      console.error("Critical Notification Error:", notificationError);
    }

    // 7. Mark Intent as Converted
    await (prisma as any).bookingIntent.updateMany({
      where: { userId: userId, gymId, status: "PENDING" },
      data: { status: "CONVERTED" }
    });

    // 8. Send WhatsApp Notifications
    try {
      if (userPhone) {
        const previousBookingsCount = await prisma.booking.count({
          where: { userId: userId, id: { not: booking.id } }
        });

        const planName = planId.includes("day") ? "Day Pass" : 
                         planId.includes("week") ? "Weekly Pass" : 
                         planId.includes("month") ? "Monthly Pass" : "Gym Pass";

        await NotificationEngine.sendBookingConfirmation(
          { phone: userPhone, name: (userName ?? "Customer") },
          planName,
          gymName || "PassFit Gym",
          otp
        );

        if (previousBookingsCount === 0) {
          await NotificationEngine.sendBookingCelebration(
            { phone: userPhone, name: (userName ?? "Customer") },
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
