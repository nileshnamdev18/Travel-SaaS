import nodemailer from 'nodemailer';

let transporter: any = null;

function getTransporter(): any {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass }
  });
  return transporter;
}

export async function sendBookingEmail(to: string, subject: string, html: string): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.log('[Email skipped - no SMTP config] To:', to, '| Subject:', subject);
    return;
  }
  try {
    await t.sendMail({ from: process.env.SMTP_FROM || 'noreply@travelpulse.in', to, subject, html });
  } catch (e) {
    console.warn('[Email failed]', e);
  }
}
