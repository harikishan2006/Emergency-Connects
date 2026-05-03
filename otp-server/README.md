# OTP Server (Node.js + Gmail SMTP)

Local backend that sends 6-digit OTP codes by email and verifies them.

## Setup

```bash
cd otp-server
npm install
cp .env.example .env
# edit .env and fill GMAIL_USER + GMAIL_APP_PASSWORD
npm start
```

The server listens on `http://localhost:3001` by default.

## Get a Gmail App Password

1. Go to https://myaccount.google.com/security and enable **2-Step Verification**.
2. Open https://myaccount.google.com/apppasswords
3. Create a new app password (any name, e.g. "OTP server").
4. Copy the 16-character password (no spaces) and paste it into `.env` as `GMAIL_APP_PASSWORD`.

## Endpoints

- `GET  /health` — returns `{ ok, smtp, from }`
- `POST /api/otp/send` — body `{ email }`
- `POST /api/otp/verify` — body `{ email, code }`

## Connecting from the React app

Open the **OTP Settings** page in the app (footer link or `/otp-settings`) and
set the API base URL to `http://localhost:3001`. Use the **Test connection**
button to confirm the server is reachable.

> The frontend talks to this server only when it's running on your laptop.
> If you want it to work for other people, deploy it (Render, Railway,
> Fly.io, etc.) and update the API base URL in the settings page.