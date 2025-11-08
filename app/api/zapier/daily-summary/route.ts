import { NextRequest, NextResponse } from "next/server";
import { requireZapierAuth } from "@/lib/auth";
import { callOpenAI } from "@/lib/llm";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail, notifyAdmin } from "@/lib/email";

type Mode = "all" | "per-tier" | "admin";
type Audience = "basic" | "pro" | "vip";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const unauth = requireZapierAuth(req);
  if (unauth) return unauth;

  try {
    const body = (await req.json()) as { mode?: Mode; subject?: string };
    const mode: Mode = (body.mode as Mode) || "all";
    const subject = body.subject || "Growfinitys — Daily Market Recap";

    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: sigs, error: sigErr } = await supabaseAdmin
      .from("signals")
      .select("*")
      .gte("scheduled_at", sinceIso)
      .order("scheduled_at", { ascending: false })
      .limit(200);
    if (sigErr) throw sigErr;

    const markdownSummary = await buildAISummary(sigs || []);

    if (mode === "admin") {
      await notifyAdmin(subject, wrapHtml(markdownSummary));
      return NextResponse.json({ ok: true, mode, recipients: 1 });
    }

    if (mode === "per-tier") {
      let total = 0;
      for (const audience of ["basic", "pro", "vip"] as Audience[]) {
        const html = wrapHtml(`# ${subject} (${audience.toUpperCase()})\n\n${filterByAudienceMD(markdownSummary, audience)}`);
        const emails = await listEmailsForAudience(audience);
        if (emails.length) {
          await sendEmail({ to: emails, subject: `${subject} — ${audience.toUpperCase()}`, html });
          total += emails.length;
        }
      }
      return NextResponse.json({ ok: true, mode, recipients: total });
    }

    const html = wrapHtml(markdownSummary);
    const emails = await listAllActiveEmails();
    if (emails.length) {
      await sendEmail({ to: emails, subject, html });
    }
    return NextResponse.json({ ok: true, mode, recipients: emails.length });
  } catch (e: any) {
    console.error("[/api/zapier/daily-summary] error", e);
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}

function wrapHtml(md: string) {
  const safe = md.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
  return `<div style="font-family:Inter,Arial,sans-serif;color:#111;line-height:1.5">${safe}</div>`;
}

async function listEmailsForAudience(audience: Audience): Promise<string[]> {
  const { data, error } = await supabaseAdmin.rpc("active_subscribers_for_audience", { p_audience: audience });
  if (error) throw error;
  return (data ?? []).map((row: any) => row.email).filter(Boolean);
}

async function listAllActiveEmails(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("member:members(email)")
    .eq("status", "active")
    .gt("ends_at", new Date().toISOString());
  if (error) throw error;
  return (data ?? []).map((row: any) => row.member?.email).filter(Boolean);
}

async function buildAISummary(sigs: any[]): Promise<string> {
  const sys = `You are a trading strategist. Return a concise, skimmable market recap as Markdown.`;
  const bullets = sigs
    .slice(0, 50)
    .map(
      (s) =>
        `- [${(s.audience || "").toUpperCase()}] ${s.title || s.symbol} ${s.type} | Entry ${s.entry} | SL ${s.sl} | TP1 ${s.tp1}${
          s.tp2 ? " | TP2 " + s.tp2 : ""
        }`
    )
    .join("\n");

  const usr = `
Context: Last 24h signals (most recent first)
${bullets || "- (no signals in last 24h)"}

Write a recap with:
- 3–5 top themes,
- noteworthy pairs, risk notes,
- very brief outlook for next session.

Return JSON:
{ "markdown": "..." }
`;

  const json = await callOpenAI([
    { role: "system", content: sys },
    { role: "user", content: usr },
  ]);

  return String(json?.markdown || "Daily recap unavailable.");
}

function filterByAudienceMD(md: string, audience: Audience): string {
  const note: Record<Audience, string> = {
    basic: "_You are receiving the Basic recap. Upgrade to Pro/VIP for more signals and priority alerts._",
    pro: "_Pro tier: you also receive Basic. VIP includes all plus automation._",
    vip: "_VIP tier: full automation & early access enabled._",
  };
  return `${note[audience]}\n\n${md}`;
}
