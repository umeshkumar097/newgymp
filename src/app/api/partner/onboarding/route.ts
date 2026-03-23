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

    // 1. Create the Gym record
    const gym = await prisma.gym.create({
      data: {
        name: data.gymName,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrls: data.images,
        ownerId: userId,
        status: "PENDING",
        // KYC Data
        panNumber: data.panNumber,
        panPhotoUrl: data.panPhoto,
        bankAccountNumber: data.bankAccount,
        bankIfscCode: data.ifscCode,
        bankProofUrl: data.chequePhoto,
        registrationDocUrl: data.registrationDoc,
      }
    });

    // 2. Create the Day Pass Plan
    await prisma.plan.create({
      data: {
        gymId: gym.id,
        type: "DAY",
        price: parseFloat(data.dayPassPrice),
      }
    });

    // 3. Update User Role to GYM_OWNER
    await prisma.user.update({
      where: { id: userId },
      data: { role: "GYM_OWNER" }
    });

    // 4. Store KYC/Legal data (Optional: Add specific model if needed, 
    // for now we can store in a Json field or just log it)
    console.log("KYC Data for Gym", gym.id, { 
      pan: data.panNumber, 
      bank: data.bankAccount, 
      ifsc: data.ifscCode 
    });

    return NextResponse.json({ success: true, gymId: gym.id });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Failed to save onboarding data", details: error.message }, { status: 500 });
  }
}
