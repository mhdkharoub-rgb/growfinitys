import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;

  // Not logged in → redirect to /login
  if (!session && !url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in
  const email = session?.user?.email;

  // ✅ Force admin redirect for Mohammad
  if (email === "mhdkharoub@gmail.com" && url.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ✅ Block others from accessing /admin
  if (url.pathname.startsWith("/admin") && email !== "mhdkharoub@gmail.com") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
