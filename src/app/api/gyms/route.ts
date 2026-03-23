import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gyms = await prisma.gym.findMany({
      where: { status: "APPROVED" },
      include: {
        plans: {
          orderBy: { price: "asc" },
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      count: gyms.length,
      gyms 
    });
  } catch (error: any) {
    console.error("API GET GYMS ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to fetch gyms", 
      details: error.message 
    }, { status: 500 });
  }
}
