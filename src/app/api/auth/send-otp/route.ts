import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppOTP } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // 1. Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 2. Set expiration (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 3. Save or Update OTP in database
    await prisma.otpVerification.upsert({
      where: { phone: phoneNumber },
      update: { otp, expiresAt, createdAt: new Date() },
      create: { phone: phoneNumber, otp, expiresAt }
    });

    // 4. Send OTP via WhatsApp
    try {
      await sendWhatsAppOTP(phoneNumber, otp, "PassFit Auth");
      console.log(`OTP Sent to ${phoneNumber}: ${otp}`);
    } catch (wsError: any) {
      console.error("WhatsApp Send Error:", wsError.message);
      // In development, we allow fallback for testing if WhatsApp is not fully configured
      if (process.env.NODE_ENV === "production") {
         return NextResponse.json({ error: "Failed to send OTP. Please try again later." }, { status: 500 });
      }
    }
    console.log(`[DEBUG] OTP for ${phoneNumber} is ${otp}`);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });

  } catch (error: any) {
    console.error("Verify Auth ERROR (Internal):", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
