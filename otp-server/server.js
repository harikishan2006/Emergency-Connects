/**
 * OTP Server — Express + Nodemailer (Gmail SMTP)
 *
 * Sends 6-digit one-time codes by email and verifies them against an
 * in-memory store. Run locally with `npm install && npm start`.
 *
 * Endpoints:
 *   GET  /health              -> { ok: true, smtp: "ready" | "error" }
 *   POST /api/otp/send        body: { email }       -> { ok: true, expiresIn }
 *   POST /api/otp/verify      body: { email, code } -> { ok: true } | 400
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const PORT = parseInt(process.env.PORT || '3001', 10);
const OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS || '300', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
const FROM_NAME = process.env.FROM_NAME || 'OTP Service';
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const ORIGINS = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.warn(
    '[warn] GMAIL_USER / GMAIL_APP_PASSWORD missing. Edit otp-server/.env before sending real emails.'
  );
}

// ── In-memory OTP store ────────────────────────────────────────────────────
// Map<email, { codeHash, expiresAt, attempts }>
const store = new Map();

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');
const generateCode = () =>
  String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');

function setOtp(email, code) {
  store.set(email.toLowerCase(), {
    codeHash: sha256(code),
    expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
    attempts: 0,
  });
}

function consumeOtp(email, code) {
  const key = email.toLowerCase();
  const entry = store.get(key);
  if (!entry) return { ok: false, reason: 'No code requested for this email' };
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { ok: false, reason: 'Code expired. Request a new one.' };
  }
  entry.attempts += 1;
  if (entry.attempts > OTP_MAX_ATTEMPTS) {
    store.delete(key);
    return { ok: false, reason: 'Too many attempts. Request a new code.' };
  }
  if (sha256(code) !== entry.codeHash) {
    return { ok: false, reason: 'Invalid code' };
  }
  store.delete(key);
  return { ok: true };
}

// Periodic cleanup of expired entries
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) if (v.expiresAt < now) store.delete(k);
}, 60_000).unref();

// ── Mail transport ─────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

let smtpReady = false;
transporter
  .verify()
  .then(() => {
    smtpReady = true;
    console.log('[smtp] Gmail transport ready as', GMAIL_USER);
  })
  .catch((err) => console.error('[smtp] verify failed:', err.message));

function buildHtml(code) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:32px;margin:0;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 12px;color:#0f172a;">Your verification code</h2>
      <p style="color:#475569;margin:0 0 24px;">Use the 6-digit code below to finish signing in. It expires in ${Math.round(
        OTP_TTL_SECONDS / 60
      )} minutes.</p>
      <div style="font-size:34px;letter-spacing:10px;font-weight:700;text-align:center;background:#0ea5e9;color:#fff;padding:18px;border-radius:10px;">${code}</div>
      <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;">If you didn't request this, you can ignore this email.</p>
    </div></body></html>`;
}

// ── App ────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '16kb' }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ORIGINS.includes('*') || ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed`));
    },
  })
);

app.get('/health', (_req, res) =>
  res.json({ ok: true, smtp: smtpReady ? 'ready' : 'error', from: GMAIL_USER || null })
);

const isEmail = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

app.post('/api/otp/send', async (req, res) => {
  const { email } = req.body || {};
  if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Invalid email' });
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return res
      .status(500)
      .json({ ok: false, error: 'Server is missing GMAIL_USER / GMAIL_APP_PASSWORD' });
  }

  const code = generateCode();
  setOtp(email, code);

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to: email,
      subject: `Your ${FROM_NAME} verification code: ${code}`,
      text: `Your verification code is ${code}. It expires in ${Math.round(
        OTP_TTL_SECONDS / 60
      )} minutes.`,
      html: buildHtml(code),
    });
    console.log(`[otp] sent to ${email}`);
    res.json({ ok: true, expiresIn: OTP_TTL_SECONDS });
  } catch (err) {
    console.error('[otp] send failed:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/otp/verify', (req, res) => {
  const { email, code } = req.body || {};
  if (!isEmail(email) || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ ok: false, error: 'Invalid email or code' });
  }
  const result = consumeOtp(email, code);
  if (!result.ok) return res.status(400).json({ ok: false, error: result.reason });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`[otp] server listening on http://localhost:${PORT}`);
  console.log(`[otp] allowed origins: ${ORIGINS.join(', ') || '(none)'}`);
});