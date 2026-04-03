import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NotificationEngine } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    let { phoneNumber, otp, name, email, password, role, mode } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 });
    }

    // Normalize: Same as send-otp to match records
    phoneNumber = phoneNumber.replace(/^\+91|^91/, "");

    // 1. Verify OTP
    const verification = await prisma.otpVerification.findUnique({
      where: { phone: phoneNumber }
    });
    
    if (!verification || verification.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    if (new Date() > verification.expiresAt) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // 2. Verified! Clear OTP
    await prisma.otpVerification.delete({
      where: { phone: phoneNumber }
    }).catch(e => console.error("OTP Delete Error:", e));

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
                role: (role === "GYM_OWNER" || role === "ADMIN") ? role : user.role
            }
        });

        // Send Welcome email for new partners (if email present)
        if (role === "GYM_OWNER" && user.email) {
            await NotificationEngine.sendWelcomePartner({ 
                email: user.email, 
                name: user.name || "Partner", 
                phone: user.phone || ""
            }).catch(e => console.error("Email Error:", e));
        }
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

        if (role === "GYM_OWNER" && user.email) {
            await NotificationEngine.sendWelcomePartner({ 
                email: user.email, 
                name: user.name || "Partner", 
                phone: user.phone || ""
            }).catch(e => console.error("Email Error:", e));
        }
    }

    // Set a session cookie
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
            name: user.name || "",
            email: user.email || ""
        }
    });

  } catch (error: any) {
    console.error("Verify Auth ERROR:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
