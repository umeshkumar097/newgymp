import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { gymId } = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize 90 days grace period
    const activationDate = new Date();
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(activationDate.getDate() + 90);

    const gym = await prisma.gym.update({
      where: { id: gymId, ownerId: userId },
      data: {
        status: "APPROVED",
        onboardingFeePaid: true,
        commissionFreeUntil: gracePeriodEnd,
      }
    });

    return NextResponse.json({ success: true, gym });
  } catch (error: any) {
    console.error("Activation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
