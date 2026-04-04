import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    let { phoneNumber, role, email: providedEmail, name: providedName } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Normalize: Strip +91 or 91 if present for consistent DB records
    phoneNumber = phoneNumber.replace(/^\+91|^91/, "");

    // Fetch user details for multi-channel notification
    const user = await prisma.user.findFirst({
      where: { phone: phoneNumber }
    });

    // Role Check for Partners/Admins
    if (role === "GYM_OWNER" || role === "ADMIN") {
      if (!user || (user.role !== "GYM_OWNER" && user.role !== "ADMIN")) {
        return NextResponse.json({ 
          error: "Aap register nahi ho. Kripya support se sampark karein.",
          notRegistered: true 
        }, { status: 404 });
      }
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

    // 4. Send OTP via Triple Channels
    // Use providedEmail/Name if user doesn't exist yet (for registration)
    await NotificationEngine.sendTripleChannelOTP({
      phone: phoneNumber,
      otp,
      email: user?.email || providedEmail,
      fcmToken: user?.fcmToken,
      name: user?.name || providedName
    });

    console.log(`[AUTH] OTP Triggered: ${phoneNumber} -> ${otp}`);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });

  } catch (error: any) {
    console.error("Verify Auth ERROR (Internal):", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
