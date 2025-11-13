import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types";

export const config = {
  matcher: ["/admin", "/dashboard", "/auth/callback"],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh the session if it exists
  await supabase.auth.getSession();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/auth/callback")) {
    return res;
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!session?.user) {
      const login = new URL("/login", req.url);
      return NextResponse.redirect(login);
    }
  }

  return res;
}
