import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Specific Admin Credentials requested by USER
    const ADMIN_EMAIL = "info@aiclex.in";
    const ADMIN_PASS = "Umesh@2003##";

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      // Find or Create the Admin user in DB to ensure role consistency
      let user = await prisma.user.findUnique({
        where: { email: ADMIN_EMAIL }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: ADMIN_EMAIL,
            name: "Super Admin",
            role: "ADMIN",
            clerkId: `admin_${Date.now()}`,
          }
        });
      } else if (user.role !== "ADMIN") {
        // Ensure the role is updated if it wasn't already ADMIN
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" }
        });
      }

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
