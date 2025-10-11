// middleware.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Only guard these paths
  const protectedPaths = ["/dashboard", "/admin"];
  if (!protectedPaths.some((p) => url.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Read Supabase auth cookie (if present) on the edge
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    }
  );

  // Try to get user from server (note: if cookie is missing, user will be null)
  const { data: { user } = {} } = await supabase.auth.getUser();

  if (!user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
