import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    let { phoneNumber, email: providedEmail, role, name: providedName } = await req.json();

    if (!phoneNumber && !providedEmail) {
      return NextResponse.json({ error: "Phone number or Email is required" }, { status: 400 });
    }

    // 1. Resolve User
    let user = null;
    if (providedEmail) {
      user = await prisma.user.findUnique({ where: { email: providedEmail.toLowerCase().trim() } });
    } else if (phoneNumber) {
      const normalizedPhone = phoneNumber.replace(/^\+91|^91/, "");
      user = await prisma.user.findFirst({ where: { phone: normalizedPhone } });
    }

    // Role Enforcement for Partners/Admins
    if (role === "GYM_OWNER" || role === "ADMIN") {
      if (!user && !providedEmail) { // Onboarding might have providedEmail but no user yet
        return NextResponse.json({ 
          error: "Account not found.",
          notRegistered: true 
        }, { status: 404 });
      }
    }

    // 2. Generate Secure 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // 3. Save to DB (Handle either Phone or Email)
    if (providedEmail) {
      const emailNorm = providedEmail.toLowerCase().trim();
      await prisma.otpVerification.upsert({
        where: { email: emailNorm },
        update: { otp, expiresAt, createdAt: new Date() },
        create: { email: emailNorm, otp, expiresAt }
      });
    } else if (phoneNumber) {
      const normalizedPhone = phoneNumber.replace(/^\+91|^91/, "");
      await prisma.otpVerification.upsert({
        where: { phone: normalizedPhone },
        update: { otp, expiresAt, createdAt: new Date() },
        create: { phone: normalizedPhone, otp, expiresAt }
      });
    }

    // 4. Sequential Delivery
    const report = await NotificationEngine.sendAuthOTP({
      phone: phoneNumber?.replace(/^\+91|^91/, ""),
      otp,
      email: providedEmail || user?.email,
      name: providedName || user?.name
    });

    console.log(`[AUTH] Delivery Report:`, report);

    if (report.whatsapp || report.email) {
      return NextResponse.json({ 
        success: true, 
        message: report.email ? "Email Sent ✅" : "WhatsApp Sent ✅",
        channels: report 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: `Could not reach you via Email or WhatsApp. ${report.error || ""}` 
    }, { status: 500 });

  } catch (error: any) {
    console.error("Auth System Final ERROR:", error);
    return NextResponse.json({ error: "System encountered an error. Please try again later." }, { status: 500 });
  }
}
