import { NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { prisma } from "../../../../lib/prisma";

// Initialize Cashfree Instance
const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);

import { sendWhatsAppOTP } from "../../../../lib/whatsapp";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { order_id, bookingData } = await req.json();

    // Fetch order payments from Cashfree
    const response = await cashfree.PGOrderFetchPayments(order_id);
    const payments = response.data;
    
    // Check for successful payment
    const successPayment = payments?.find((p: any) => p.payment_status === "SUCCESS");

    if (successPayment) {
      // Ensure we have a valid user identity
      const userId = session?.user ? (session.user as any).id : null;
      
      if (!userId) {
          return NextResponse.json({ error: "Session identity missing during verification" }, { status: 401 });
      }

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Create or Update booking
      const booking = await prisma.booking.create({
        data: {
          userId: userId,
          gymId: bookingData.gymId,
          planId: bookingData.planId,
          bookingDates: bookingData.bookingDates || [new Date()],
          totalAmount: bookingData.amount,
          paymentId: successPayment.cf_payment_id?.toString() || order_id,
          status: "BOOKED",
          otp: otp,
          qrCode: `passfit-${order_id}`,
          members: bookingData.members || [],
          selectedAddons: bookingData.addons || [],
        },
      });

      // Send WhatsApp OTP
      try {
        await sendWhatsAppOTP(
          bookingData.customerPhone || "9999999999", 
          otp
        );
        console.log("WhatsApp OTP sent successfully");
      } catch (wsError) {
        console.error("Failed to send WhatsApp OTP:", wsError);
      }

      return NextResponse.json({ success: true, bookingId: booking.id });
    } else {
      return NextResponse.json({ success: false, message: "Payment not successful" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Cashfree Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
