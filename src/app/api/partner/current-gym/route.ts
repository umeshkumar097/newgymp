import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gym = await prisma.gym.findFirst({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, gym });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
