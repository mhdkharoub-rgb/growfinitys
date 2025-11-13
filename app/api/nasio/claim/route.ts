import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { email } = await request.json();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user_id = profile?.id ?? null;

  if (!user_id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await supabase.from("claims").insert({
    user_id,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ message: "Claim recorded successfully" });
}
