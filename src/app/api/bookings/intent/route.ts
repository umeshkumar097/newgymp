import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const userId = (await cookies()).get("user_id")?.value;
    if (!userId) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gymId, planId, amount, members, addons } = await req.json();

    // Check for existing pending intent
    const existingIntent = await (prisma as any).bookingIntent.findFirst({
      where: {
        userId,
        gymId,
        status: "PENDING"
      }
    });

    if (existingIntent) {
      await (prisma as any).bookingIntent.update({
        where: { id: existingIntent.id },
        data: {
          planId,
          amount,
          members,
          selectedAddons: addons,
          updatedAt: new Date()
        }
      });
      return NextResponse.json({ success: true, intentId: existingIntent.id });
    } else {
      const newIntent = await (prisma as any).bookingIntent.create({
        data: {
          userId,
          gymId,
          planId,
          amount,
          members,
          selectedAddons: addons,
          status: "PENDING"
        }
      });
      return NextResponse.json({ success: true, intentId: newIntent.id });
    }

  } catch (error: any) {
    console.error("Intent Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
