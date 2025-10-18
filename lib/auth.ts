export function isAdmin(email?: string | null) {
  return !!email && email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();
}

export function requireCronSecret(req: Request) {
  const header = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret");
  if (!header || header !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}
