import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabaseServer";

export function requireZapierAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.ZAPIER_SECRET;
  if (!secret) {
    console.warn("[auth] ZAPIER_SECRET not set; allowing request (dev)");
    return null;
  }

  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : req.nextUrl.searchParams.get("auth");

  if (token !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return null;
}

export async function requireSession() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const adminEmail =
    process.env.ADMIN_EMAIL?.toLowerCase() ||
    process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  const email = session.user.email?.toLowerCase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin" || (adminEmail && email === adminEmail);
  if (!isAdmin) redirect("/dashboard");

  return session;
}
