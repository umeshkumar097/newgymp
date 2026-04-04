import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NotificationEngine } from "@/lib/notifications";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export async function POST(req: Request) {
  try {
    let { phoneNumber, otp, name, email, mode } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 });
    }

    // 1. Normalize: Strip +91/91 for consistency in Prisma
    const normalizedPhone = phoneNumber.replace(/^\+91|^91/, "");

    // 2. Fetch OTP from DB
    const verification = await prisma.otpVerification.findUnique({
      where: { phone: normalizedPhone }
    });

    // 3. Validate OTP
    if (!verification || verification.otp !== otp) {
      return NextResponse.json({ error: "Invalid verification code. Please try again." }, { status: 400 });
    }

    // 4. Check Expiration
    if (new Date() > verification.expiresAt) {
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }

    // 5. Get or Create User
    let user = await prisma.user.findFirst({
      where: { phone: normalizedPhone }
    });

    if (!user && mode === "register") {
      // Create new user for first-time signups
      user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          name: name || "User",
          email: email || `${normalizedPhone}@passfit.in`,
          role: "CUSTOMER",
          status: "ACTIVE"
        }
      });
      console.log(`[AUTH] New user created: ${normalizedPhone}`);
      
      // Welcome notification
      await NotificationEngine.sendWelcomePartner({ 
        email: user.email, 
        name: user.name, 
        phone: user.phone 
      }).catch(e => console.error("Welcome Notification Error:", e));

    } else if (!user && mode === "login") {
       return NextResponse.json({ 
         error: "Account not found. Please register first.",
         notRegistered: true 
       }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ error: "Authentication failed. Could not find or create user." }, { status: 500 });
    }

    // 6. Generate Session Token (JWT)
    const token = sign(
      { userId: user.id, role: user.role, phone: user.phone },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // 8. Cleanup used OTP
    await prisma.otpVerification.delete({
      where: { phone: normalizedPhone }
    }).catch(() => {});

    console.log(`[AUTH] Successful login: ${normalizedPhone} (${user.role})`);

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, role: user.role } 
    });

  } catch (error: any) {
    console.error("Verification System ERROR:", error);
    return NextResponse.json({ error: "Authentication system error. Please try again later." }, { status: 500 });
  }
}
