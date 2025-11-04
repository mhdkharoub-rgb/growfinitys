import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";
const PROTECTED_PATHS = ["/api/admin"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Retrieve Supabase session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Is this the admin panel or login page?
  const isAdminPanel = pathname === "/admin" || pathname.startsWith("/admin/login");
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  // ✅ Protect API routes (server endpoints)
  if (isProtected) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // ❌ Block if session user is not the admin
    if (session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized: admin email required" },
        { status: 403 }
      );
    }
  }

  // ✅ Allow visiting /admin even if not logged in
  // but prevent redirect loops if already logged in
  if (isAdminPanel && session?.user.email === ADMIN_EMAIL) {
    return NextResponse.next();
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
