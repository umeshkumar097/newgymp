import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NotificationEngine } from "@/lib/notifications";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export async function POST(req: Request) {
  try {
    let { phoneNumber, email: providedEmail, otp, name, mode } = await req.json();

    if ((!phoneNumber && !providedEmail) || !otp) {
      return NextResponse.json({ error: "Identifier (Phone/Email) and OTP are required" }, { status: 400 });
    }

    // 1. Fetch OTP from DB (Handling either Phone or Email)
    let verification = null;
    if (providedEmail) {
      const emailNorm = providedEmail.toLowerCase().trim();
      verification = await prisma.otpVerification.findUnique({ where: { email: emailNorm } });
    } else if (phoneNumber) {
      const normalizedPhone = phoneNumber.replace(/^\+91|^91/, "");
      verification = await prisma.otpVerification.findUnique({ where: { phone: normalizedPhone } });
    }

    // 2. Validate OTP
    if (!verification || verification.otp !== otp) {
      return NextResponse.json({ error: "Invalid verification code. Please try again." }, { status: 400 });
    }

    // 3. Check Expiration
    if (new Date() > verification.expiresAt) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    // 4. Get or Create User
    let user = null;
    if (providedEmail) {
      const emailNorm = providedEmail.toLowerCase().trim();
      user = await prisma.user.findUnique({ where: { email: emailNorm } });
    } else if (phoneNumber) {
      const normalizedPhone = phoneNumber.replace(/^\+91|^91/, "");
      user = await prisma.user.findFirst({ where: { phone: normalizedPhone } });
    }

    if (!user && mode === "register") {
      // Create new user for first-time signups
      const emailNorm = providedEmail?.toLowerCase().trim() || `${Math.random().toString(36).substring(7)}@passfit.in`;
      user = await prisma.user.create({
        data: {
          clerkId: `passfit_${Date.now()}`,
          phone: phoneNumber?.replace(/^\+91|^91/, ""),
          name: name || "User",
          email: emailNorm,
          role: "USER",
        }
      });
      console.log(`[AUTH] New user created via OTP: ${emailNorm}`);
    }

    if (!user) {
      return NextResponse.json({ error: "Authentication failed. Could not find or create user." }, { status: 500 });
    }

    // 5. Generate Session Token (JWT)
    const token = sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });

    // 7. Cleanup used OTP
    if (providedEmail) {
      await prisma.otpVerification.delete({ where: { email: providedEmail.toLowerCase().trim() } }).catch(() => {});
    } else if (phoneNumber) {
      const normalizedPhone = phoneNumber.replace(/^\+91|^91/, "");
      await prisma.otpVerification.delete({ where: { phone: normalizedPhone } }).catch(() => {});
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, role: user.role } 
    });

  } catch (error: any) {
    console.error("Verification System ERROR:", error);
    return NextResponse.json({ error: "Authentication system error. Please try again later." }, { status: 500 });
  }
}
