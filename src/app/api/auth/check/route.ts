import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ loggedIn: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({ 
      loggedIn: true, 
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    return NextResponse.json({ loggedIn: false }, { status: 500 });
  }
}
