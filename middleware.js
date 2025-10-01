import { NextResponse } from "next/server"
import { supabase } from "./lib/supabase"

export async function middleware(req) {
  const sessionEmail = req.cookies.get("session_email")?.value
  const url = req.nextUrl

  if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/api/signals")) {
    if (!sessionEmail) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Optionally check role
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("email", sessionEmail)
      .single()

    if (!user) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}
