import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateSignal, Audience } from "@/lib/signals";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendSignalEmail } from "@/lib/emails";

export const dynamic = "force-dynamic";

function validateAudience(value: unknown): value is Audience {
  return value === "basic" || value === "pro" || value === "vip";
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { audience, count } = await req.json();

    if (!validateAudience(audience)) {
      return NextResponse.json({ success: false, error: "audience must be one of basic, pro, vip" }, { status: 400 });
    }

    const total = Math.max(1, Math.min(10, Number(count) || 1));

    const supabase = supabaseServer();

    const generated = await Promise.all(
      Array.from({ length: total }, () => generateSignal(audience))
    );

    const { error: insertErr } = await supabase.from("signals").insert(generated);
    if (insertErr) {
      throw insertErr;
    }

    const { data: subs, error: subsErr } = await supabase.rpc("active_subscribers_for_audience", {
      p_audience: audience,
    });
    if (subsErr) {
      throw subsErr;
    }

    const emails = (subs ?? []).map((row: any) => row.email).filter(Boolean) as string[];
    if (emails.length) {
      const subject = `📈 ${generated.length} new ${audience.toUpperCase()} signals`;
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;background:#000;color:#f5f5f5;padding:16px;">
          <h2 style="color:#d4af37;margin-bottom:12px;">Growfinitys Signals Update</h2>
          <ul style="list-style:none;padding:0;margin:0;">
            ${generated
              .map(
                (sig) => `
                  <li style="margin-bottom:16px;border:1px solid #333;padding:12px;border-radius:12px;">
                    <div style="font-weight:600;color:#d4af37;">${sig.title}</div>
                    <div>${sig.symbol} · ${sig.type}</div>
                    <div>Entry: ${sig.entry} · SL: ${sig.sl} · TP1: ${sig.tp1}${
                      sig.tp2 ? ` · TP2: ${sig.tp2}` : ""
                    }</div>
                    <div style="color:#aaa;">Risk: ${sig.risk.toUpperCase()}</div>
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
      `;

      await Promise.all(emails.map((email) => sendSignalEmail(email, subject, html)));
    }

    return NextResponse.json({
      success: true,
      message: `✅ ${generated.length} new ${audience.toUpperCase()} signals generated and dispatched.`,
      emailed: emails.length,
    });
  } catch (err: any) {
    console.error("❌ Signal generation failed:", err);
    return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
  }
}
