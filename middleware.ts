import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isPublicRoute, REDIRECTS } from "./utils/routeUtils";
import { PublicMetadata } from "./types";



export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    // ✅ 0. Skip middleware for the webhook endpoint (important for server-to-server calls)
    if (pathname === "/api/webhook/register") {
      return NextResponse.next();
    }


    // 1️⃣ Not logged in & route is protected → Redirect to /sign-up
    if (!userId && !isPublicRoute(pathname)) {
      return NextResponse.redirect(new URL(REDIRECTS.UNAUTHENTICATED, req.url));
    }


    // 2️⃣ Logged in but accessing /sign-in or /sign-up → Redirect to /home
    if (userId && REDIRECTS.AUTH_FORBIDDEN.includes(pathname)) {
      return NextResponse.redirect(new URL(REDIRECTS.AUTHENTICATED, req.url));
    }


    // 3️⃣ Logged in → Role checks
    if (userId) {
      const publicMetadata = sessionClaims?.publicMetadata as PublicMetadata | undefined;
      const role = publicMetadata?.role;

      
      if (role === "admin" && pathname === "/home") {
        return NextResponse.redirect(new URL(REDIRECTS.ADMIN_HOME, req.url));
      }

      
      if (role !== "admin" && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL(REDIRECTS.USER_HOME, req.url));
      }
    }



    // ✅ Allow normal flow
    return NextResponse.next();

  } catch (error) {
    console.error("❌ Middleware error:", error);
    // Avoid showing sensitive info, redirect to error page
    return NextResponse.redirect(new URL(REDIRECTS.ERROR, req.url));
  }
});



export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|api/webhook/register).*)",
    "/api/(.*)"
  ]
};