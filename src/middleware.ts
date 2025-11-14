// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define arrays for auth and unauth routes
const authRoutes = [
  "/dashboard",
  "/content-library",
  "/earnings",
  "/settings",
  "/media",
  "/content-upload",
  "/content-approval"
];

const unAuthRoutes = [
  "/login",
  "/signup",
  "/reset-password",
  "/signup/:path*",
  "/forgot-password",
  "/verify-otp"
];

// Helper to check if the pathname matches any route in the array
function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(route => {
    if (route.endsWith("/:path*")) {
      // Match dynamic routes like /media/:path*
      const base = route.replace("/:path*", "");
      return pathname.startsWith(base);
    }
    return pathname === route || pathname.startsWith(route + "/");
  });
}

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken");
  console.log('[refresh-Token]', refreshToken?.value?.substring(0, 10), '...');

  const { pathname } = req.nextUrl;

  const isAuthRoute = matchesRoute(pathname, authRoutes);
  const isUnAuthRoute = matchesRoute(pathname, unAuthRoutes);

  if (isAuthRoute && !refreshToken) {
    // redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isUnAuthRoute && refreshToken) {
    // redirect authenticated users to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/content-library/:path*",
    "/earnings/:path*",
    "/settings/:path*",
    "/media/:path*",
    "/content-upload/:path*",
    "/content-approval/:path*",
    "/login",
    "/signup/:path*",
    "/reset-password",
    "/forgot-password",
    "/verify-otp",
  ],
};
