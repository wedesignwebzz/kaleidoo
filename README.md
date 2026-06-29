# Kaleidoo — Coming Soon

> Neurodiversity-first hiring. Get hired for what you do, not how you interview.

Single-page waitlist site. Next.js 15 + App Router, TypeScript, plain CSS (no Tailwind), Resend for email and audience storage.

---

## Quick start

```bash
# 1. Install Node 20+ if you haven't: https://nodejs.org
npm install

# 2. Copy the env template and fill in your keys
cp .env.example .env.local

# 3. Run in development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Required | Notes |
|---|---|---|
| `EMAIL_PROVIDER` | No (default `resend`) | `resend` or `gmail` |
| `NOTIFY_EMAIL` | No (default `kaleidoojobsearch@gmail.com`) | Where signup notifications go |
| `RESEND_API_KEY` | If using Resend | Get from [resend.com](https://resend.com) |
| `RESEND_AUDIENCE_ID` | If using Resend | Created in Resend dashboard → Audiences |
| `FROM_EMAIL` | If using Resend | Use `onboarding@resend.dev` until kaleidoo.co.uk domain is verified in Resend |
| `GMAIL_USER` | If using Gmail | Your Gmail address |
| `GMAIL_APP_PASSWORD` | If using Gmail | Gmail App Password — **not** your normal password. Requires 2FA on the account: Google Account → Security → 2-Step Verification → App passwords |
| `DATABASE_URL` | No | Postgres/MySQL connection string for an optional backup `waitlist_signups` table. If absent, this step is silently skipped. |

### Getting a Resend API key (recommended path)

1. Sign up at [resend.com](https://resend.com) (free tier covers this use case easily).
2. Add and verify `kaleidoo.co.uk` in **Domains**. Until then, use `onboarding@resend.dev` as `FROM_EMAIL` for testing — notification emails arrive but welcome emails won't send to external addresses.
3. Create an Audience in **Audiences** and copy the ID into `RESEND_AUDIENCE_ID`.
4. Create an API key in **API Keys** and copy into `RESEND_API_KEY`.

### Getting a Gmail App Password (alternative path)

1. Enable 2-Step Verification on your Google Account.
2. Go to **Google Account → Security → 2-Step Verification → App passwords**.
3. Create a new app password (name it "Kaleidoo SMTP" or similar).
4. Use the 16-character password as `GMAIL_APP_PASSWORD`. Your normal password will not work.

---

## Deployment

### Vercel (recommended for this site)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars via dashboard or CLI
vercel env add RESEND_API_KEY production
vercel env add RESEND_AUDIENCE_ID production
vercel env add FROM_EMAIL production
```

The route handler at `/api/subscribe` runs as a serverless function automatically.

### VPS / Liquid Web (alongside the main Kaleidoo app)

```bash
# Build
npm run build

# Start (keep alive with pm2 or systemd)
npm start            # listens on port 3000 by default
# or
PORT=3001 npm start  # if 3000 is taken
```

**nginx reverse proxy config** (place in `/etc/nginx/sites-available/kaleidoo-coming-soon`):

```nginx
server {
    listen 80;
    server_name www.kaleidoo.co.uk kaleidoo.co.uk;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then enable it and reload nginx:

```bash
ln -s /etc/nginx/sites-available/kaleidoo-coming-soon /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

Add TLS with Certbot: `certbot --nginx -d kaleidoo.co.uk -d www.kaleidoo.co.uk`.

**pm2 process config** (`ecosystem.config.js`):

```js
module.exports = {
  apps: [{
    name: 'kaleidoo-coming-soon',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: { PORT: 3000, NODE_ENV: 'production' }
  }]
}
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## File structure

```
app/
  layout.tsx              fonts, metadata, <body> wrapper
  page.tsx                landing page (server component)
  page.module.css
  globals.css             design tokens + base styles
  api/subscribe/route.ts  waitlist POST handler
components/
  Nav.tsx / .module.css
  CalmToggle.tsx / .module.css   client — localStorage Calm mode
  KaleidoscopeHero.tsx / .module.css  client — SVG kaleidoscope + rAF spin
  WaitlistForm.tsx / .module.css client — form, fetch, states
  Footer.tsx / .module.css
lib/
  email.ts                notifyNewSignup(), addToAudience() — Resend & Gmail
  validate.ts             isValidEmail(), sanitiseString()
```

---

## Calm mode

A signature Kaleidoo feature. Pressing **Calm** in the nav:

- Desaturates the colour palette (`--sat: 0.62`).
- Stops all CSS animations and transitions instantly.
- Freezes the kaleidoscope spin.
- Persists in `localStorage` under the key `k_calm`.
- Is also respected automatically when the OS `prefers-reduced-motion` media query is set.
