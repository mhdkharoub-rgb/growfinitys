const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Growfinitys <no-reply@growfinitys.app>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_TO_ADMIN;

type SendOpts = { to: string | string[]; subject: string; html: string };

export async function sendEmail({ to, subject, html }: SendOpts) {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY missing, skipping send");
    return { skipped: true };
  }

  const recipients: string | string[] = Array.isArray(to) ? to.filter(Boolean) : to;
  if (Array.isArray(recipients) && recipients.length === 0) {
    console.warn("[email] No recipients provided, skipping send");
    return { skipped: true };
  }
  if (typeof recipients === "string" && !recipients.trim()) {
    console.warn("[email] Empty recipient, skipping send");
    return { skipped: true };
  }

  const body = { from: EMAIL_FROM, to: recipients, subject, html };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[email] Resend error:", text);
    throw new Error("Email send failed");
  }

  return res.json();
}

export async function notifyAdmin(subject: string, html: string) {
  if (!ADMIN_EMAIL) {
    console.warn("[email] ADMIN_EMAIL missing, cannot notify admin");
    return;
  }
  await sendEmail({ to: ADMIN_EMAIL, subject, html });
}
