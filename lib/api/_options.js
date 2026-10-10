// NIFTY option chain from SmartAPI. Lists the NIFTY contracts once (cached 6h),
// picks the nearest expiry + strikes around ATM, then returns live OI per strike
// (optionChain) or the OI change inside a time window (oiChange).
import { quoteTokens, oiHistory, searchScrip } from './_smartapi.js';

const MON = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
const parseExp = (e) => { const m = e.match(/^(\d{2})([A-Z]{3})(\d{2})$/); return new Date(2000 + +m[3], MON[m[2]], +m[1]); };
const OPT = /^NIFTY(\d{2}[A-Z]{3}\d{2})(\d+)(CE|PE)$/; // e.g. NIFTY13OCT2622500CE

// All NIFTY option contracts via one SmartAPI search (~3s) instead of the 34 MB scrip master.
let master = null, masterAt = 0;
async function niftyOptions() {
  if (master && Date.now() - masterAt < 6 * 3600 * 1000) return master;
  const options = (await searchScrip('NFO', 'NIFTY'))
    .map((x) => { const m = x.tradingsymbol.match(OPT); return m && { token: x.symboltoken, symbol: x.tradingsymbol, expiry: m[1], strike: +m[2], type: m[3] }; })
    .filter(Boolean);
  if (!options.length) throw new Error('SmartAPI returned no NIFTY option contracts.');
  master = options;
  masterAt = Date.now();
  return master;
}

// Nearest expiry, spot/ATM, and the CE+PE contracts within Â±range of ATM.
async function contracts(range) {
  const opts = await niftyOptions();
  if (!opts.length) throw new Error('No NIFTY option contracts are available.');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = [...new Set(opts.map((o) => o.expiry))].filter((e) => parseExp(e) >= today).sort((a, b) => parseExp(a) - parseExp(b))[0];
  if (!expiry) throw new Error('No unexpired NIFTY option contracts are available.');
  const [idx] = await quoteTokens('NSE', [{ symbol: 'NIFTY', token: '99926000' }]);
  if (idx?.ltp == null) throw new Error('NIFTY index quote is unavailable for option analysis.');
  const spot = idx.ltp, atm = Math.round(spot / 50) * 50;
  const picks = opts.filter((o) => o.expiry === expiry && Math.abs(o.strike - atm) <= range);
  if (!picks.length) throw new Error('No NIFTY option contracts are available around the current spot price.');
  return { expiry, spot: +spot.toFixed(2), atm, picks };
}

// Group per-contract values into strike rows, highest strike first.
function byStrike(picks, value) {
  const rows = {};
  for (const o of picks) {
    const amount = value(o);
    if (amount == null) continue;
    const r = (rows[o.strike] ||= { strike: o.strike, ce: 0, pe: 0 });
    r[o.type === 'CE' ? 'ce' : 'pe'] = amount;
  }
  return Object.values(rows).sort((a, b) => b.strike - a.strike);
}

// Live total OI per strike (+ PCR).
export async function optionChain(range = 600) {
  const { expiry, spot, atm, picks } = await contracts(range);
  const q = {};
  for (let i = 0; i < picks.length; i += 45) (await quoteTokens('NFO', picks.slice(i, i + 45))).forEach((r) => { q[r.symbol] = r; });
  const strikes = byStrike(picks, (o) => q[o.symbol]?.oi).map((r) => ({ strike: r.strike, ceOI: r.ce, peOI: r.pe }));
  const totCE = strikes.reduce((s, r) => s + r.ceOI, 0), totPE = strikes.reduce((s, r) => s + r.peOI, 0);
  if (!strikes.length || totCE + totPE <= 0) throw new Error('SmartAPI returned no usable NIFTY option open-interest data.');
  return { spot, atm, expiry, strikes, totCE, totPE, pcr: totCE ? +(totPE / totCE).toFixed(2) : null };
}

// OI change per strike between two times ("HH:MM") of the latest session.
// CE change = bears (call writing), PE change = bulls (put writing).
const cache = new Map();
export async function oiChange(from = '09:15', to = '15:30', range = 400) {
  const key = from + '-' + to;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 60 * 1000) return hit.data;
  const { expiry, spot, atm, picks } = await contracts(range);
  const chg = {}, oi = {};
  let session = null;
  for (const o of picks) {
    const pts = await oiHistory('NFO', o.token);
    if (!pts.length) continue;
    session ||= pts[pts.length - 1].time.slice(0, 10); // latest trading day in the data
    const day = pts.filter((p) => p.time.slice(0, 10) === session);
    const inWin = day.filter((p) => { const t = p.time.slice(11, 16); return t >= from && t <= to; });
    if (!inWin.length) continue;
    chg[o.symbol] = inWin[inWin.length - 1].oi - inWin[0].oi;
    oi[o.symbol] = inWin[inWin.length - 1].oi;
  }
  const strikes = byStrike(picks, (o) => chg[o.symbol]).map((r) => ({ strike: r.strike, ceChg: r.ce, peChg: r.pe }));
  const totOI = byStrike(picks, (o) => oi[o.symbol]);
  const data = {
    spot, atm, expiry, session, from, to, strikes,
    ceChg: strikes.reduce((s, r) => s + r.ceChg, 0), peChg: strikes.reduce((s, r) => s + r.peChg, 0),
    totCE: totOI.reduce((s, r) => s + r.ce, 0), totPE: totOI.reduce((s, r) => s + r.pe, 0),
  };
  if (!strikes.length || data.totCE + data.totPE <= 0) throw new Error('SmartAPI returned no usable NIFTY option OI history for this session.');
  cache.set(key, { at: Date.now(), data });
  return data;
}

