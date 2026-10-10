import crypto from 'node:crypto';

const COOKIE = 'tradesaathi_session';
const SESSION_SECONDS = 12 * 60 * 60;
const attempts = new Map();

function config() {
  const password = process.env.APP_PASSWORD;
  const secret = process.env.APP_SESSION_SECRET;
  if (!password || password.length < 12 || !secret || secret.length < 32) return null;
  return { password, secret };
}

function digest(value) {
  return crypto.createHash('sha256').update(String(value)).digest();
}

function same(value, expected) {
  return crypto.timingSafeEqual(digest(value), digest(expected));
}

function signature(expiry, secret) {
  return crypto.createHmac('sha256', secret).update(`${COOKIE}.${expiry}`).digest('base64url');
}

function secureRequest(req) {
  return req.socket?.encrypted || req.headers?.['x-forwarded-proto'] === 'https';
}

function setCookie(res, value, maxAge, req) {
  const secure = secureRequest(req) ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${secure}`
  );
}

function sessionValue(req) {
  const raw = String(req.headers?.cookie || '')
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  return raw || '';
}

export function hasSession(req) {
  const settings = config();
  if (!settings) return false;
  const [expiry, provided, ...extra] = sessionValue(req).split('.');
  if (extra.length || !/^\d{10,13}$/.test(expiry || '') || !provided) return false;
  const expiresAt = Number(expiry);
  const now = Math.floor(Date.now() / 1000);
  if (expiresAt <= now || expiresAt > now + SESSION_SECONDS) return false;
  return same(provided, signature(expiry, settings.secret));
}

export function requireSession(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (!config()) {
    res.status(503).json({
      error: 'Private app access is not configured. Set APP_PASSWORD and APP_SESSION_SECRET.',
    });
    return false;
  }
  if (!hasSession(req)) {
    res.status(401).json({ error: 'Sign in to access private market data.' });
    return false;
  }
  return true;
}

export async function readRequestBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 4096) throw new Error('Request body is too large.');
  }
  try {
    return JSON.parse(body || '{}');
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

export async function login(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const settings = config();
  if (!settings) {
    res.status(503).json({
      error: 'Private app access is not configured. Set APP_PASSWORD (12+ characters) and APP_SESSION_SECRET (32+ characters).',
    });
    return;
  }

  const address = req.headers?.['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';
  const now = Date.now();
  const record = attempts.get(address);
  if (record && record.until > now && record.count >= 10) {
    res.setHeader('Retry-After', String(Math.ceil((record.until - now) / 1000)));
    res.status(429).json({ error: 'Too many sign-in attempts. Try again later.' });
    return;
  }

  try {
    const body = await readRequestBody(req);
    if (typeof body.password !== 'string' || !same(body.password, settings.password)) {
      const current = record && record.until > now ? record : { count: 0, until: now + 15 * 60 * 1000 };
      current.count += 1;
      attempts.set(address, current);
      res.status(401).json({ error: 'Incorrect password.' });
      return;
    }

    attempts.delete(address);
    const expiry = String(Math.floor(now / 1000) + SESSION_SECONDS);
    const value = `${expiry}.${signature(expiry, settings.secret)}`;
    setCookie(res, value, SESSION_SECONDS, req);
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function logout(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  setCookie(res, '', 0, req);
  res.status(200).json({ authenticated: false });
}

export function sessionStatus(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (!config()) {
    res.status(503).json({ authenticated: false, error: 'Private app access is not configured.' });
    return;
  }
  res.status(hasSession(req) ? 200 : 401).json({ authenticated: hasSession(req) });
}

export function requireWebSocketSession(req) {
  return hasSession(req);
}

