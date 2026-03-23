import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { phoneNumber, otp, name, email, password, role, mode } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 });
    }

    // 1. Verify OTP (Allow 1111 as master OTP for dev/test)
    const verification = await prisma.otpVerification.findUnique({
      where: { phone: phoneNumber }
    });

    const isMasterOtp = otp === "1111";
    
    if (!isMasterOtp && (!verification || verification.otp !== otp)) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    // Check expiration only for real OTPs
    if (!isMasterOtp && verification && new Date() > verification.expiresAt) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // 2. Verified! Clear OTP
    if (!isMasterOtp) {
      await prisma.otpVerification.delete({
        where: { phone: phoneNumber }
      });
    }

    // 3. Get or Create User
    let user = await prisma.user.findFirst({
        where: { phone: phoneNumber }
    });

    if (user) {
        // Update existing user with provided details
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name || user.name,
                email: email || user.email,
                password: password || user.password,
                role: role || user.role
            }
        });
    } else {
        // Create new user
        user = await prisma.user.create({
            data: {
                clerkId: `clerk_${Date.now()}`,
                email: email || `${phoneNumber}@passfit.in`,
                phone: phoneNumber,
                name: name || "New User",
                password: password || null,
                role: role || "USER"
            }
        });
    }

    // Set a session cookie (unencrypted for dev/demo)
    (await cookies()).set("user_id", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 2, // 2 hours
        path: "/",
    });

    return NextResponse.json({ 
        success: true, 
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });

  } catch (error: any) {
    console.error("Verify Auth ERROR:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
