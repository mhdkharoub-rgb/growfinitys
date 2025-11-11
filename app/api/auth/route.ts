import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return NextResponse.json({ error: "No active session" }, { status: 401 });

  return NextResponse.json({
    user: session.user.email,
    expires_at: session.expires_at,
  });
}

export async function POST(req: Request) {
  const { email } = await req.json();
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    message: "Magic link sent. Check your inbox.",
    email,
  });
}

export async function DELETE() {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();
  return NextResponse.json({ message: "Logged out successfully." });
}
