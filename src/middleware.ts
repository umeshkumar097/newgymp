import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access Auth while logged in, redirect to home
  if (pathname === "/auth" && userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Protect Admin Routes
  if (pathname.startsWith("/admin") && !userId) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // 3. Protect Partner Dashboards (excluding onboarding)
  if (pathname.startsWith("/partner") && (pathname.includes("/dashboard") || pathname.includes("/settings")) && !userId) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/auth"],
};
