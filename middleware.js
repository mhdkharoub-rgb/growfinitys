// /middleware.js
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error } = await supabase.auth.getUser()

  // Not logged in? → redirect to login page
  if (error || !data?.user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const { user } = data
  const { data: userRecord } = await supabase
    .from("users")
    .select("role")
    .eq("email", user.email)
    .single()

  const isAdmin = userRecord?.role === "admin"

  const adminRoutes = ["/admin", "/dashboard"]

 if (adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
  if (!isAdmin) {
    // Show the restricted access page instead of redirect
    return NextResponse.rewrite(new URL("/restricted", req.url))
  }
}


  return NextResponse.next()
}

// Limit which routes use this middleware
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
