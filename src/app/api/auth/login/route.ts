import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

/**
 * UNIFIED LOGIN API (Mobile App & Web)
 * Endpoint: /api/auth/login
 * Method: POST
 * Body: { email, password }
 */

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Email and password are required" 
      }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Find User by Email
    const user = await prisma.user.findUnique({
      where: { email: emailNormalized }
    });

    if (!user || !user.password) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, { status: 401 });
    }

    // 2. Compare Password (Bcrypt)
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, { status: 401 });
    }

    // 3. Set Session Cookies (for hybrid support)
    const cookieStore = await cookies();
    cookieStore.set("user_id", user.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    cookieStore.set("role", user.role, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
    });

    console.log(`[AUTH] Login success: ${user.email} (Role: ${user.role})`);

    // 4. Return User Profile for the App
    return NextResponse.json({ 
      success: true, 
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error("LOGIN API ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: "System error during login. Please try again later." 
    }, { status: 500 });
  }
}
