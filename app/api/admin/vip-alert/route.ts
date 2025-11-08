import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    console.error("❌ No Supabase user found", userErr);
    return NextResponse.json({ error: "Unauthorized - no user" }, { status: 401 });
  }

  // Check if user is admin or trusted email
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  const email = user.email || profile?.email || "";
  const role = profile?.role || "";

  // ✅ Flexible check: allows admin role OR trusted email
  const isAdmin =
    role === "admin" ||
    email === "mhdkharoub.rgb@gmail.com" ||
    email === "mhdkharoub123@gmail.com";

  if (!isAdmin) {
    console.error("Unauthorized - role/email mismatch", { role, email });
    return NextResponse.json({ error: "Unauthorized - role/email mismatch" }, { status: 401 });
  }

  // Send to Zapier (using env variable)
  const webhookUrl = process.env.ZAPIER_VIP_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Missing Zapier webhook URL" }, { status: 500 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audience: "vip", count: 12 }),
    });

    const text = await res.text();
    console.log("✅ VIP alert sent:", text);

    return NextResponse.json({ success: true, result: text });
  } catch (err: any) {
    console.error("❌ Failed to send alert:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
