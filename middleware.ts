import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard", "/admin"];

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const isProtected = PROTECTED.some(p => url.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set() {},
        remove() {}
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // admin path guard
  if (url.pathname.startsWith("/admin") && user.email !== process.env.ADMIN_EMAIL) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
