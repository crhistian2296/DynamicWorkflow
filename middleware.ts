import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = (pathname: string) =>
  pathname.startsWith("/sign-in") ||
  pathname.startsWith("/sign-up") ||
  pathname.startsWith("/api/workflows") ||
  pathname.startsWith("/api/chat") ||
  pathname === "/api/webhooks/stripe";

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request.nextUrl.pathname)) {
      const { isAuthenticated } = await auth();

      if (!isAuthenticated) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("redirect_url", request.url);
        return NextResponse.redirect(signInUrl);
      }
    }
  },
  { clockSkewInMs: 60_000 },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
