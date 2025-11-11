import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseRoute } from "@/lib/supabaseServer";

export async function POST() {
  const supa = supabaseRoute(cookies());
  await supa.auth.signOut();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://growfinitys.vercel.app";
  return NextResponse.redirect(new URL("/", base));
}
