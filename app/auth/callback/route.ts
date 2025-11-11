import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseRoute } from "@/lib/supabaseServer";

// Handles the Supabase magic-link callback directly via a route handler. A
// corresponding page.tsx was removed to avoid conflicting handlers in this
// segment.

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=otp", req.url));
  }

  const supa = supabaseRoute(cookies());
  const { error } = await supa.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=otp", req.url));
  }

  const {
    data: { session },
  } = await supa.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login?error=session", req.url));
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const email = session.user.email?.toLowerCase();

  let dest = "/dashboard";

  const { data: profile } = await supa
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profile?.role === "admin" || (adminEmail && email === adminEmail)) {
    dest = "/admin";
  }

  return NextResponse.redirect(new URL(dest, req.url));
}
