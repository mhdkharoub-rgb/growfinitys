import { createRouteHandlerClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

export async function requireAdmin(req?: NextRequest) {
  const supabase = req
    ? createRouteHandlerClient({ cookies })
    : createServerComponentClient({ cookies });

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  const user = data?.user;
  if (!user) {
    throw new Error("Unauthorized: No user logged in");
  }

  if (!user.email?.endsWith("@growfinitys.com")) {
    throw new Error("Unauthorized: Not an admin");
  }

  return user;
}
