import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const ADMIN_EMAIL = "mhdkharoub@gmail.com";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const email = session?.user?.email;

  if (url.pathname === "/" || url.pathname.startsWith("/login")) {
    return res;
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (email === ADMIN_EMAIL && url.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (url.pathname.startsWith("/admin") && email !== ADMIN_EMAIL) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
