import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

type Tier = "vip" | "pro" | "basic";

export async function handleAdminRelay(req: NextRequest, tier: Tier) {
  const supabase = createRouteHandlerClient<Database>({ cookies, headers });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    message: `✅ ${tier.toUpperCase()} alert executed by ${email}`,
  });
}
