import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // 1. Clear via Store
  cookieStore.delete("user_id");
  
  // 2. Force clearance via Response
  const response = NextResponse.json({ 
    success: true, 
    message: "Logged out successfully" 
  });
  
  response.cookies.set("user_id", "", { 
    path: "/", 
    maxAge: -1,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  return response;
}
