import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gym = await prisma.gym.findUnique({
      where: { id: id },
      include: {
        plans: {
          orderBy: { price: "asc" },
        }
      }
    });

    if (!gym) {
      return NextResponse.json({ error: "Gym not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, gym });
  } catch (error: any) {
    console.error("API GET GYM DETAIL ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to fetch gym", 
      details: error.message 
    }, { status: 500 });
  }
}
