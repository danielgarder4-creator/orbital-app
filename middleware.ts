import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";

// ──────────────────────────────────────────────────────────────
// Route protection. Runs before every request to a matched path.
// - /dashboard, /products, /store-builder, etc. (the (app) group)
//   require a signed-in session.
// - /admin requires session.user.role === "ADMIN" (role is added
//   to the JWT/session in lib/auth/config.ts callbacks).
// Unauthenticated visitors are redirected to /login with a
// callbackUrl so they land back where they intended after signing in.
// ──────────────────────────────────────────────────────────────

const PROTECTED_PREFIXES = [
  "/dashboard", "/products", "/store-builder", "/ai-content", "/ai-ads",
  "/orders", "/analytics", "/suppliers", "/seo", "/automations",
  "/settings", "/billing",
];

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } }) => {
  const { pathname } = req.nextUrl;
  const session = (req as any).auth;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdmin = pathname.startsWith("/admin");

  if ((isProtected || isAdmin) && !session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*", "/products/:path*", "/store-builder/:path*",
    "/ai-content/:path*", "/ai-ads/:path*", "/orders/:path*",
    "/analytics/:path*", "/suppliers/:path*", "/seo/:path*",
    "/automations/:path*", "/settings/:path*", "/billing/:path*",
    "/admin/:path*",
  ],
};
