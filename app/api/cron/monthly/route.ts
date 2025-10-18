export const runtime = "nodejs";

export async function GET() {
  const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/signals/generate?period=monthly`, {
    method: "POST",
    headers: { "x-cron-secret": process.env.CRON_SECRET! }
  });
  return new Response(await r.text(), { status: r.status });
}
