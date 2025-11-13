import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies, headers });
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url));
}
