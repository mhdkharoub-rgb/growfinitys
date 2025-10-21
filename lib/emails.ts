import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendSignalEmail(to: string, subject: string, html: string) {
try {
await resend.emails.send({
from: 'Growfinitys <noreply@growfinitys.vercel.app>',
to,
subject,
html
});
} catch (e) {
console.error('Resend error', e);
}
}
