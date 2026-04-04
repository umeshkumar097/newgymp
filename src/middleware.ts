import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Skip middleware for static files, API routes, and auth pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("favicon.ico") ||
    pathname === "/auth" ||
    pathname === "/auth/complete-profile"
  ) {
    return NextResponse.next();
  }

  // 2. If user is logged in but missing phone number (from JWT), redirect to complete-profile
  // EXCEPT for specific allowed public pages if any
  if (token && !token.phone) {
    // Only redirect if they are not already on the onboarding page
    if (pathname !== "/auth/complete-profile") {
        return NextResponse.redirect(new URL("/auth/complete-profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
