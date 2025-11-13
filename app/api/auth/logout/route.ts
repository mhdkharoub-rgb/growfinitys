import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies, headers });
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url));
import { cookies } from "next/headers";
import type { Database } from "@/lib/types";

export async function POST() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  await supabase.auth.signOut();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/login", base));
}
