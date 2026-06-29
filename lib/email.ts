/**
 * Email abstraction — two implementations selected by EMAIL_PROVIDER env var.
 *
 *  resend (default): uses Resend SDK for transactional email + Audience storage.
 *  gmail:            uses Nodemailer + Gmail SMTP (App Password required, not your
 *                    normal Gmail password). Audience step is skipped in this mode.
 */

export interface SignupData {
  email: string;
  name?: string;
  interest?: string;
  timestamp: string;
}

/* ─── Shared helpers ──────────────────────────────────────────────────────── */

function notifyBody(data: SignupData): string {
  return [
    `New Kaleidoo waitlist signup`,
    ``,
    `Email:     ${data.email}`,
    `Name:      ${data.name ?? "—"}`,
    `Interest:  ${data.interest ?? "—"}`,
    `Time:      ${data.timestamp}`,
  ].join("\n");
}

function notifyHtml(data: SignupData): string {
  return `
<table style="font-family:sans-serif;font-size:15px;color:#1B1230;border-collapse:collapse">
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Email</td><td>${data.email}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Name</td><td>${data.name ?? "—"}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Interest</td><td>${data.interest ?? "—"}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Time</td><td>${data.timestamp}</td></tr>
</table>`;
}

/* ─── Resend implementation ───────────────────────────────────────────────── */

async function resendNotify(data: SignupData) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from =
    process.env.FROM_EMAIL && process.env.FROM_EMAIL.length > 0
      ? process.env.FROM_EMAIL
      : "onboarding@resend.dev";

  const notifyEmail = process.env.NOTIFY_EMAIL ?? "kaleidoojobsearch@gmail.com";

  await resend.emails.send({
    from,
    to: notifyEmail,
    subject: `New Kaleidoo waitlist signup — ${data.email}`,
    text: notifyBody(data),
    html: notifyHtml(data),
  });

  /* Optional welcome email to the subscriber */
  if (from !== "onboarding@resend.dev") {
    await resend.emails.send({
      from,
      to: data.email,
      subject: "You're on the Kaleidoo waitlist",
      text: [
        `Hi${data.name ? ` ${data.name}` : ""},`,
        ``,
        `Thanks for signing up to the Kaleidoo waitlist. We'll reach out as soon as the platform is ready.`,
        ``,
        `In the meantime, if you have any questions you can reach us at ${notifyEmail}.`,
        ``,
        `— The Kaleidoo team`,
      ].join("\n"),
    });
  }
}

async function resendAddToAudience(data: SignupData) {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return; // audience not configured — skip silently

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.contacts.create({
      audienceId,
      email: data.email,
      firstName: data.name?.split(" ")[0],
      lastName: data.name?.split(" ").slice(1).join(" ") || undefined,
      unsubscribed: false,
    });
  } catch (err: unknown) {
    /* Tolerate "already exists" — everything else re-throws */
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.toLowerCase().includes("already exist")) throw err;
  }
}

/* ─── Gmail / Nodemailer implementation ──────────────────────────────────── */

async function gmailNotify(data: SignupData) {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App Password — not your normal password
    },
  });

  const notifyEmail = process.env.NOTIFY_EMAIL ?? "kaleidoojobsearch@gmail.com";

  await transporter.sendMail({
    from: `Kaleidoo Waitlist <${process.env.GMAIL_USER}>`,
    to: notifyEmail,
    subject: `New Kaleidoo waitlist signup — ${data.email}`,
    text: notifyBody(data),
    html: notifyHtml(data),
  });
}

/* Gmail mode skips audience — no Resend account needed */
async function gmailAddToAudience(_data: SignupData) {
  /* no-op */
}

/* ─── Public interface ────────────────────────────────────────────────────── */

function getProvider(): "resend" | "gmail" {
  const p = (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase();
  return p === "gmail" ? "gmail" : "resend";
}

export async function notifyNewSignup(data: SignupData): Promise<void> {
  if (getProvider() === "gmail") {
    await gmailNotify(data);
  } else {
    await resendNotify(data);
  }
}

export async function addToAudience(data: SignupData): Promise<void> {
  if (getProvider() === "gmail") {
    await gmailAddToAudience(data);
  } else {
    await resendAddToAudience(data);
  }
}
