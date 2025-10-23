import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function sendSignalEmail(to: string, subject: string, html: string) {
  const client = getResendClient();
  if (!client) {
    console.warn("RESEND_API_KEY is not configured. Skipping email send.");
    return;
  }

  try {
    await client.emails.send({
      from: "Growfinitys <noreply@growfinitys.vercel.app>",
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error("Resend error", e);
  }
}
