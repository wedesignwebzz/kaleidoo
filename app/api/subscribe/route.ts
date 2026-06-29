import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, sanitiseString } from "@/lib/validate";
import { notifyNewSignup, addToAudience } from "@/lib/email";

/* ─── In-memory rate limiter ─────────────────────────────────────────────── */
/* Acceptable for a temporary landing page. Replace with Redis/Upstash for scale. */
const ipHits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;         // max requests
const RATE_WINDOW = 60_000;   // per 60 seconds

function rateCheck(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

/* ─── Optional DB backup ─────────────────────────────────────────────────── */
async function maybeInsertDb(data: {
  email: string;
  name?: string;
  interest?: string;
}) {
  const url = process.env.DATABASE_URL;
  if (!url) return;

  try {
    /* Dynamic import so the build doesn't fail if the driver isn't installed */
    const { default: postgres } = await import("postgres" as string);
    const sql = postgres(url, { max: 1 });

    await sql`
      CREATE TABLE IF NOT EXISTS waitlist_signups (
        id         SERIAL PRIMARY KEY,
        email      TEXT NOT NULL,
        name       TEXT,
        interest   TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO waitlist_signups (email, name, interest)
      VALUES (${data.email}, ${data.name ?? null}, ${data.interest ?? null})
      ON CONFLICT DO NOTHING
    `;

    await sql.end();
  } catch (err) {
    console.error("[waitlist] DB backup failed (non-fatal):", err);
  }
}

/* ─── Route handler ──────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* IP for rate limiting */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!rateCheck(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  /* Honeypot — return 200 silently so bots receive no signal */
  if (body.company_website && String(body.company_website).trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  /* Validate email */
  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const email = body.email.trim().toLowerCase();
  const name = sanitiseString(body.name);
  const raw = sanitiseString(body.interest);
  const interest =
    raw === "talent" || raw === "employer" || raw === "both" ? raw : undefined;

  const timestamp = new Date().toISOString();
  const signupData = { email, name, interest, timestamp };

  /* Add to audience list first — this is the persistent store */
  try {
    await addToAudience(signupData);
  } catch (err) {
    console.error("[waitlist] addToAudience failed:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your signup. Please try again." },
      { status: 500 }
    );
  }

  /* Send notification email.
     For Resend: non-fatal — the audience is the source of truth.
     For Gmail:  fatal — email is the only store, so surface the error. */
  const provider = (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase();
  try {
    await notifyNewSignup(signupData);
  } catch (err) {
    console.error("[waitlist] notifyNewSignup failed:", err);
    if (provider === "gmail") {
      return NextResponse.json(
        { ok: false, error: "We couldn't send your signup — please try again shortly." },
        { status: 500 }
      );
    }
    /* Resend mode: log and continue — contact is already in the audience */
  }

  /* Optional DB backup (fully non-blocking) */
  maybeInsertDb({ email, name, interest }).catch(() => {});

  return NextResponse.json({ ok: true });
}
