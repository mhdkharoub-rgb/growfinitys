import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resendKey) return; // no-op if not configured
  const resend = new Resend(resendKey);
  await resend.emails.send({
    from: "Growfinitys <no-reply@growfinitys.app>",
    to,
    subject,
    html
  });
}

export const emails = {
  welcome: (plan: string) =>
    `<p>Welcome to Growfinitys! Your <b>${plan}</b> plan is active. Head to your dashboard to see the latest signals.</p>`,
  renewed: (plan: string) =>
    `<p>Your <b>${plan}</b> plan has renewed. Enjoy continued access!</p>`,
  expired: (plan: string) =>
    `<p>Your <b>${plan}</b> plan has expired. You can re-subscribe any time.</p>`
};
