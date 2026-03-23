import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { 
        email,
        password, // In a real app, use hashing here. But current schema uses plain text passwords.
        role: { in: ["GYM_OWNER", "ADMIN"] }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        error: "Invalid credentials or you are not registered as a partner." 
      }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("user_id", user.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60, // 2 hours
    });
    cookieStore.set("role", user.role, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60,
    });

    return NextResponse.json({ success: true, redirect: "/partner/dashboard" });

  } catch (error: any) {
    console.error("Login Password ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
