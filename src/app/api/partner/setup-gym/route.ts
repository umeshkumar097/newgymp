import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const gym = await prisma.gym.findFirst({
      where: { ownerId: userId }
    });

    if (!gym) {
      return NextResponse.json({ error: "Gym not found" }, { status: 404 });
    }

    // Update Media & Amenities
    if (data.images || data.amenities) {
        await prisma.gym.update({
            where: { id: gym.id },
            data: {
                imageUrls: data.images || gym.imageUrls,
                description: data.description || gym.description
            }
        });
        // Handle Amenities (as Addons or simple string field if we add it)
        // For now, let's just update the description or a new field if added.
    }

    // Update Pricing
    if (data.plans) {
        // Clear old ones and add new ones (Day, Week, Month)
        await prisma.plan.deleteMany({ where: { gymId: gym.id } });
        
        await prisma.plan.createMany({
            data: data.plans.map((p: any) => ({
                gymId: gym.id,
                type: p.type,
                price: parseFloat(p.price)
            }))
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Setup Error:", error);
    return NextResponse.json({ error: "Failed to setup gym", details: error.message }, { status: 500 });
  }
}
