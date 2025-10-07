// /middleware.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: req.headers.get("Authorization") } } }
  )

  const { data } = await supabase.auth.getSession()
  const user = data?.session?.user

  const protectedRoutes = ["/dashboard"]

  if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path)) && !user) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"],
}
