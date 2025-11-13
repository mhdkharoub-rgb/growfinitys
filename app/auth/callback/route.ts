import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorCode = url.searchParams.get("error_code");

  if (error || errorCode) {
    const back = new URL("/login", url.origin);
    back.searchParams.set("error", error || "");
    back.searchParams.set("error_code", errorCode || "");
    return NextResponse.redirect(back);
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies, headers });
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "";

    const target =
      user?.email &&
      adminEmail &&
      user.email.toLowerCase() === adminEmail.toLowerCase()
        ? "/admin"
        : "/dashboard";

    return NextResponse.redirect(new URL(target, url.origin));
  }

  return NextResponse.redirect(new URL("/login", url.origin));
import { cookies } from "next/headers";
import { supabaseRoute } from "@/lib/supabaseServer";

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

  const adminEmail =
    process.env.ADMIN_EMAIL?.toLowerCase() ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
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
