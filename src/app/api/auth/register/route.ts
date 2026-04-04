import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

/**
 * USER REGISTRATION
 * Endpoint: /api/auth/register
 */

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    // 2. Hash the password
    const hashedPassword = await hash(password, 12);

    // 3. Create the User
    const user = await prisma.user.create({
      data: {
        name,
        email: emailNormalized,
        password: hashedPassword,
        role: "USER",
        consentSignedAt: new Date(),
        clerkId: `passfit_native_${Date.now()}`, // Temporary clerkId for existing schema compatibility
      },
    });

    console.log(`[AUTH] New user registered: ${user.email}`);

    return NextResponse.json({ 
      success: true, 
      message: "Registration successful! You can now sign in.",
      user: { id: user.id, email: user.email }
    });

  } catch (error: any) {
    console.error("Registration ERROR:", error);
    return NextResponse.json({ error: "System error during registration. Please try again later." }, { status: 500 });
  }
}
