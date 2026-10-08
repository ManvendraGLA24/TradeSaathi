// NIFTY option chain from SmartAPI. Downloads the scrip master once (cached),
// picks the nearest expiry + strikes around ATM, and fetches live OI per strike.
import { quoteTokens } from './_smartapi.js';

const MASTER = 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json';
const MON = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
const parseExp = (e) => { const m = e.match(/^(\d{2})([A-Z]{3})(\d{4})$/); return m ? new Date(+m[3], MON[m[2]], +m[1]) : new Date(8640000000000000); };

let cache = null, cacheAt = 0;
async function niftyOptions() {
  if (cache && Date.now() - cacheAt < 6 * 3600 * 1000) return cache;
  const all = JSON.parse(await (await fetch(MASTER)).text());
  cache = all.filter((x) => x.name === 'NIFTY' && x.instrumenttype === 'OPTIDX' && x.exch_seg === 'NFO')
    .map((x) => ({ token: x.token, symbol: x.symbol, expiry: x.expiry, strike: +x.strike / 100, type: x.symbol.slice(-2) }));
  cacheAt = Date.now();
  return cache;
}

export async function optionChain(range = 600) {
  const opts = await niftyOptions();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = [...new Set(opts.map((o) => o.expiry))].filter((e) => parseExp(e) >= today).sort((a, b) => parseExp(a) - parseExp(b))[0];
  const [idx] = await quoteTokens('NSE', [{ symbol: 'NIFTY', token: '99926000' }]);
  const spot = idx.ltp, atm = Math.round(spot / 50) * 50;
  const picks = opts.filter((o) => o.expiry === expiry && Math.abs(o.strike - atm) <= range);

  const quotes = {};
  for (let i = 0; i < picks.length; i += 45) {
    const q = await quoteTokens('NFO', picks.slice(i, i + 45));
    q.forEach((r) => { quotes[r.symbol] = r; });
  }

  const byStrike = {};
  for (const o of picks) {
    const q = quotes[o.symbol] || {};
    const row = (byStrike[o.strike] = byStrike[o.strike] || { strike: o.strike, ceOI: 0, peOI: 0, ceLtp: null, peLtp: null });
    if (o.type === 'CE') { row.ceOI = q.oi || 0; row.ceLtp = q.ltp ?? null; }
    else { row.peOI = q.oi || 0; row.peLtp = q.ltp ?? null; }
  }
  const strikes = Object.values(byStrike).sort((a, b) => b.strike - a.strike);
  const totCE = strikes.reduce((s, r) => s + r.ceOI, 0);
  const totPE = strikes.reduce((s, r) => s + r.peOI, 0);
  return { spot: +spot.toFixed(2), atm, expiry, strikes, totCE, totPE, pcr: totCE ? +(totPE / totCE).toFixed(2) : 0 };
}
