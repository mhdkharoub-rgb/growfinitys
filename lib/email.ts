const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Growfinitys <no-reply@growfinitys.app>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

type SendOpts = { to: string | string[]; subject: string; html: string };

export async function sendEmail({ to, subject, html }: SendOpts) {
  if (!RESEND_API_KEY) return { skipped: true };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function notifyAdmin(subject: string, html: string) {
  if (!ADMIN_EMAIL) return;
  await sendEmail({ to: ADMIN_EMAIL, subject, html });
}
