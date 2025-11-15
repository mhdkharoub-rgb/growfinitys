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
}
