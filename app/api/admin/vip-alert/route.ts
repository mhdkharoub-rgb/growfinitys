import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Debug logging for Vercel logs
    console.log("🔐 Supabase getUser result:", user);
    if (authError) console.error("Auth error:", authError);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized - no user found" }), {
        status: 401,
      });
    }

    // Fetch profile role from DB
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("👤 Profile result:", profile);
    if (profileError) console.error("Profile query error:", profileError);

    // ✅ TEMPORARY email-based fallback for Mohammad
    const adminEmail = "mhdkharoub.rgb@gmail.com"; // ⬅️ Replace with your exact login email

    if (profile?.role !== "admin" && user.email !== adminEmail) {
      return new Response(JSON.stringify({ error: "Unauthorized - role/email mismatch" }), {
        status: 403,
      });
    }

    // --- Main alert logic ---
    const payload = await req.json();

    console.log("🚀 Incoming payload:", payload);

    // Send to Zapier webhook securely using env var
    const webhookUrl = process.env.ZAPIER_VIP_WEBHOOK_URL;
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: "Webhook URL not configured" }), { status: 500 });
    }

    const zapResp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!zapResp.ok) {
      const errorText = await zapResp.text();
      console.error("Zapier webhook failed:", errorText);
      return new Response(JSON.stringify({ error: "Zapier webhook failed", details: errorText }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Unexpected error in /api/admin/vip-alert:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: String(err) }), {
      status: 500,
    });
  }
}
