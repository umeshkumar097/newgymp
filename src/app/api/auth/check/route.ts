import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * HYBRID AUTH CHECK API
 * Supports: 1. NextAuth (Web Sessions)
 *           2. Manual Cookies (Mobile/Unified Auth)
 */

export async function GET() {
  try {
    // 1. Check for NextAuth Session (Primary Web Auth)
    const session = await getServerSession(authOptions);

    if (session && session.user) {
      return NextResponse.json({ 
        loggedIn: true, 
        source: "session",
        user: {
          id: (session.user as any).id,
          name: session.user.name,
          role: (session.user as any).role,
          phone: (session.user as any).phone
        }
      });
    }

    // 2. Fallback: Check for Manual user_id Cookie (Mobile/Hybrid Auth)
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, role: true, phone: true }
      });

      if (user) {
        return NextResponse.json({ 
          loggedIn: true, 
          source: "cookie",
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            phone: user.phone
          }
        });
      }
    }

    // 3. Unauthenticated
    return NextResponse.json({ loggedIn: false });

  } catch (error) {
    console.error("Auth Check Error:", error);
    return NextResponse.json({ loggedIn: false }, { status: 500 });
  }
}
