// Angel One SmartAPI server-side client (shared helper, not an HTTP route).
// Reads credentials from env (never exposed to the browser). Serializes + throttles
// calls to respect SmartAPI rate limits, retries on rate-limit, and caches the
// session + symbol->token lookups across warm invocations.
import crypto from 'node:crypto';
import { NSE_TOKENS } from './_tokens.js';

const BASE = 'https://apiconnect.angelbroking.com';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const baseHeaders = () => ({
  'Content-Type': 'application/json', 'Accept': 'application/json',
  'X-UserType': 'USER', 'X-SourceID': 'WEB',
  'X-ClientLocalIP': '127.0.0.1', 'X-ClientPublicIP': '127.0.0.1', 'X-MACAddress': '00:00:00:00:00:00',
  'X-PrivateKey': process.env.SMARTAPI_API_KEY,
});

function base32decode(s) {
  s = String(s).replace(/=+$/, '').replace(/\s/g, '').toUpperCase();
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0, val = 0; const out = [];
  for (const c of s) { const i = A.indexOf(c); if (i < 0) continue; val = (val << 5) | i; bits += 5; if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; } }
  return Buffer.from(out);
}
function totp(secret) {
  const key = base32decode(secret);
  const counter = Math.floor(Date.now() / 1000 / 30);
  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);
  const h = crypto.createHmac('sha1', key).update(buf).digest();
  const o = h[h.length - 1] & 0xf;
  const n = ((h[o] & 0x7f) << 24) | ((h[o + 1] & 0xff) << 16) | ((h[o + 2] & 0xff) << 8) | (h[o + 3] & 0xff);
  return (n % 1_000_000).toString().padStart(6, '0');
}

// --- serialize + throttle every SmartAPI HTTP call (respects per-second limits) ---
let lastAt = 0, mutex = Promise.resolve();
const GAP = 450; // ms between calls
async function rawPost(path, headers, body) {
  const task = mutex.then(async () => {
    for (let i = 0; i < 4; i++) {
      const wait = Math.max(0, lastAt + GAP - Date.now());
      if (wait) await sleep(wait);
      lastAt = Date.now();
      const res = await fetch(BASE + path, { method: 'POST', headers, body: JSON.stringify(body) });
      const text = await res.text();
      let j = null; try { j = JSON.parse(text); } catch { /* non-JSON below */ }
      if (j) return j;
      if (/exceeding access rate|denied/i.test(text)) { await sleep(1300); continue; }
      throw new Error('SmartAPI non-JSON response: ' + text.slice(0, 120));
    }
    throw new Error('SmartAPI: rate-limited after retries');
  });
  mutex = task.then(() => {}, () => {});
  return task;
}

let session = null; // { jwt, at }
async function getSession() {
  if (session && Date.now() - session.at < 6 * 3600 * 1000) return session;
  const r = await rawPost('/rest/auth/angelbroking/user/v1/loginByPassword', baseHeaders(), {
    clientcode: process.env.SMARTAPI_CLIENT_CODE, password: process.env.SMARTAPI_MPIN, totp: totp(process.env.SMARTAPI_TOTP_SECRET),
  });
  if (!r?.data?.jwtToken) throw new Error('SmartAPI login failed: ' + (r.message || '') + ' ' + (r.errorcode || ''));
  session = { jwt: r.data.jwtToken, at: Date.now() };
  return session;
}
async function authed(path, body) {
  let s = await getSession();
  let j = await rawPost(path, { ...baseHeaders(), Authorization: 'Bearer ' + s.jwt }, body);
  if (j?.errorcode === 'AG8001' || /invalid token/i.test(j?.message || '')) {
    session = null; s = await getSession();
    j = await rawPost(path, { ...baseHeaders(), Authorization: 'Bearer ' + s.jwt }, body);
  }
  return j;
}

const tokenCache = new Map();
export async function resolveToken(exchange, symbol) {
  // Baked map first — no API call for known NSE symbols.
  if (exchange === 'NSE' && NSE_TOKENS[symbol]) return { tradingsymbol: symbol + '-EQ', symboltoken: NSE_TOKENS[symbol] };
  const key = exchange + ':' + symbol;
  if (tokenCache.has(key)) return tokenCache.get(key);
  const j = await authed('/rest/secure/angelbroking/order/v1/searchScrip', { exchange, searchscrip: symbol });
  const list = j?.data || [];
  const pick = list.find((x) => x.tradingsymbol === symbol + '-EQ') || list.find((x) => x.tradingsymbol === symbol) || list[0];
  const tok = pick ? { tradingsymbol: pick.tradingsymbol, symboltoken: pick.symboltoken } : null;
  tokenCache.set(key, tok);
  return tok;
}

// Live quote rows for a list of { symbol, token } (one batch call, no lookups).
export async function quoteTokens(exchange, items) {
  if (!items.length) return [];
  const j = await authed('/rest/secure/angelbroking/market/v1/quote/', { mode: 'FULL', exchangeTokens: { [exchange]: items.map((i) => String(i.token)) } });
  const byTok = new Map((j?.data?.fetched || []).map((f) => [String(f.symbolToken), f]));
  return items.map((i) => {
    const f = byTok.get(String(i.token)) || {};
    return {
      symbol: i.symbol, ltp: f.ltp ?? null, open: f.open ?? null, high: f.high ?? null, low: f.low ?? null, close: f.close ?? null,
      pct: f.percentChange ?? null, change: f.netChange ?? null, volume: f.tradeVolume ?? null,
    };
  });
}

// Live quote rows for symbols on an exchange (default NSE equity).
export async function quoteFull(exchange, symbols) {
  const resolved = [];
  for (const s of symbols) { const t = await resolveToken(exchange, s); if (t) resolved.push({ symbol: s, ...t }); }
  if (!resolved.length) return [];
  const j = await authed('/rest/secure/angelbroking/market/v1/quote/', { mode: 'FULL', exchangeTokens: { [exchange]: resolved.map((r) => r.symboltoken) } });
  const byTok = new Map((j?.data?.fetched || []).map((f) => [String(f.symbolToken), f]));
  return resolved.map((r) => {
    const f = byTok.get(String(r.symboltoken)) || {};
    return {
      symbol: r.symbol, tradingsymbol: r.tradingsymbol,
      ltp: f.ltp ?? null, open: f.open ?? null, high: f.high ?? null, low: f.low ?? null, close: f.close ?? null,
      pct: f.percentChange ?? null, change: f.netChange ?? null, volume: f.tradeVolume ?? null,
    };
  });
}
