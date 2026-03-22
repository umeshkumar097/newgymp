import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (user && user.password === password && user.role === "ADMIN") {
      // Set Session Cookie
      (await cookies()).set("user_id", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day for admin
        path: "/",
      });

      return NextResponse.json({ success: true, message: "Admin authenticated" });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
