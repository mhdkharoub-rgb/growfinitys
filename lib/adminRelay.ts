import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "./auth";

type Tier = "vip" | "pro" | "basic";

const WEBHOOK_ENV_KEYS: Record<Tier, string> = {
  vip: "ZAPIER_VIP_WEBHOOK_URL",
  pro: "ZAPIER_PRO_WEBHOOK_URL",
  basic: "ZAPIER_BASIC_WEBHOOK_URL",
};

function extractToken(req: NextRequest) {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  if (header) {
    return header;
  }
  const queryToken = req.nextUrl.searchParams.get("auth");
  return queryToken ?? null;
}

async function ensureAuthorized(req: NextRequest) {
  const secret = process.env.ZAPIER_SECRET;
  if (secret) {
    const token = extractToken(req);
    if (token === secret) {
      return true;
    }
  }

  try {
    await requireAdmin(req);
    return true;
  } catch (error) {
    console.warn("[adminRelay] Unauthorized access attempt", error);
    return false;
  }
}

export async function relayTierAlert(req: NextRequest, tier: Tier) {
  const authorized = await ensureAuthorized(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const envKey = WEBHOOK_ENV_KEYS[tier];
  const webhookUrl = process.env[envKey];
  if (!webhookUrl) {
    const message = `Missing ${envKey} environment variable`;
    console.error(`[adminRelay] ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const payload = {
    event: `${tier}-alert`,
    tier,
    triggeredAt: new Date().toISOString(),
    ...body,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();

  const result = {
    success: response.ok,
    ok: response.ok,
    tier,
    zapierStatus: response.status,
    zapierResponse: text,
  };

  if (!response.ok) {
    console.error("[adminRelay] Zapier relay failed", result);
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json(result);
}
