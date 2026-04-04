import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // 1. Redirect logged-in users away from /auth
    if (pathname === "/auth" && !!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Extra logic for specific roles if needed
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes
        if (pathname === "/" || pathname === "/auth") return true;
        
        // Protected routes require a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/auth"],
};
