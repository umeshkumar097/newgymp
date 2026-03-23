import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NotificationEngine } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 1. Create/Update the Gym record
    // Using any cast temporarily if IDE persists with stale type cache
    const gym = await (prisma.gym as any).create({
      data: {
        name: data.gymName,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        imageUrls: [],
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
        price: parseFloat(data.dayPassPrice || "0"),
      }
    });

    // 3. Update User details & Role
    await prisma.user.update({
      where: { id: userId },
      data: { 
          role: "GYM_OWNER",
          name: data.name || undefined,
          email: data.email || undefined,
          password: data.password || undefined
      }
    });

    // 5. Send Notification (Under Review)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.email) {
        await NotificationEngine.sendOnboardingConfirmation(
            { email: user.email, name: user.name || "Partner", phone: user.phone },
            data.gymName
        ).catch(err => console.error("Onboarding Email Error:", err));
    }

    return NextResponse.json({ success: true, gymId: gym.id });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Failed to save onboarding data", details: error.message }, { status: 500 });
  }
}
