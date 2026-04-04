import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    let { phoneNumber, role, email: providedEmail, name: providedName } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // 1. Normalize: Strip +91/91 for consistency in Prisma
    const normalizedPhone = phoneNumber.replace(/^\+91|^91/, "");

    // 2. Fetch or Mock User
    const user = await prisma.user.findFirst({
      where: { phone: normalizedPhone }
    });

    // Role Enforcement for Partners/Admins
    if (role === "GYM_OWNER" || role === "ADMIN") {
      if (!user || (user.role !== "GYM_OWNER" && user.role !== "ADMIN")) {
        return NextResponse.json({ 
          error: "This phone number is not registered as a Partner.",
          notRegistered: true 
        }, { status: 404 });
      }
    }

    // 3. Generate Secure 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // 4. Save to DB
    await prisma.otpVerification.upsert({
      where: { phone: normalizedPhone },
      update: { otp, expiresAt, createdAt: new Date() },
      create: { phone: normalizedPhone, otp, expiresAt }
    });

    // 5. Sequential Delivery (WhatsApp then Email)
    const report = await NotificationEngine.sendAuthOTP({
      phone: normalizedPhone,
      otp,
      email: user?.email || providedEmail,
      name: user?.name || providedName
    });

    console.log(`[AUTH] Delivery Report for ${normalizedPhone}:`, report);

    if (report.whatsapp || report.email) {
      return NextResponse.json({ 
        success: true, 
        message: report.whatsapp ? "WhatsApp Sent ✅" : "Email Sent ✅ (WhatsApp Delayed)",
        channels: report 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: `Could not reach you via WhatsApp or Email. ${report.error}` 
    }, { status: 500 });

  } catch (error: any) {
    console.error("Auth System Final ERROR:", error);
    return NextResponse.json({ error: "System encountered an error. Please try again later." }, { status: 500 });
  }
}
