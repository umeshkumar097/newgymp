import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      name, 
      email, 
      phone, 
      altPhone, 
      password, 
      gymName, 
      imageUrls, 
      dayPassPrice,
      location = "Pending Update" 
    } = data;

    if (!email || !phone || !password || !gymName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Partner account already exists with this email or phone" }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await hash(password, 12);

    // 3. Start Atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create User
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          phone,
          password: hashedPassword,
          role: "GYM_OWNER",
          clerkId: `rapid_onboard_${Date.now()}`,
        }
      });

      // Create Gym
      const gym = await tx.gym.create({
        data: {
          name: gymName,
          location: location,
          imageUrls: imageUrls || [],
          ownerId: user.id,
          status: "PENDING",
          baseCommissionRate: 15.0,
          commissionFreeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
        }
      });

      // Create Initial Plan
      await tx.plan.create({
        data: {
          gymId: gym.id,
          name: "Standard Day Pass",
          type: "DAY",
          price: parseFloat(dayPassPrice || "0"),
        }
      });

      return { userId: user.id, gymId: gym.id };
    });

    // 4. Set Session Cookie
    const cookieStore = await cookies();
    cookieStore.set("user_id", result.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ 
      success: true, 
      gymId: result.gymId,
      message: "Gym onboarded successfully! Welcome to the launch fleet."
    });

  } catch (error: any) {
    console.error("Rapid Onboarding Error:", error);
    return NextResponse.json({ 
      error: "Rapid onboarding failed", 
      details: error.message 
    }, { status: 500 });
  }
}
