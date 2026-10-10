// GET /api/fiidii -> FII/DII cash-market activity (₹ Cr), newest first.
//  • latest day: NSE fiidiiTradeReact (gross buy / sell / net)
//  • ~30-day history: Moneycontrol FII/DII page data (net + NIFTY close / % change)
import { requireSession } from './_auth.js';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const num = (v) => (v == null || v === '' ? null : +String(v).replace(/,/g, ''));
const MON = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

let cookie = null, cookieAt = 0, nseFailAt = 0;
// NSE is optional extra detail (gross buy/sell), so it gets one short budget for both calls.
async function nseLatest() {
  if (Date.now() - nseFailAt < 2 * 60 * 1000) throw new Error('NSE skipped (failed recently)');
  const signal = AbortSignal.timeout(3500);
  if (!cookie || Date.now() - cookieAt > 10 * 60 * 1000) {
    const r = await fetch('https://www.nseindia.com/', { headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' }, signal });
    cookie = r.headers.getSetCookie().map((c) => c.split(';')[0]).join('; '); cookieAt = Date.now();
  }
  const arr = await (await fetch('https://www.nseindia.com/api/fiidiiTradeReact', {
    headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Accept-Language': 'en-US,en;q=0.9', 'Referer': 'https://www.nseindia.com/reports/fii-dii', 'Cookie': cookie },
    signal,
  })).json();
  const fii = arr.find((x) => /FII|FPI/i.test(x.category)) || {}, dii = arr.find((x) => /DII/i.test(x.category)) || {};
  const [d, m, y] = String(fii.date || dii.date).split('-'); // 09-Oct-2026
  return { date: `${y}-${MON[m]}-${d}`, fiiBuy: num(fii.buyValue), fiiSell: num(fii.sellValue), fiiNet: num(fii.netValue),
    diiBuy: num(dii.buyValue), diiSell: num(dii.sellValue), diiNet: num(dii.netValue) };
}

async function mcHistory() {
  const html = await (await fetch('https://www.moneycontrol.com/markets/fii-dii-data/', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) })).text();
  const json = JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]);
  return json.props.pageProps.FiiDiiData.fiiDiiData.map((r) => ({
    date: r.date, fiiNet: num(r.fiiCM), diiNet: num(r.diiCM), niftyClose: num(r.niftyClose), niftyPct: num(r.niftyChangePer),
    fiiBuy: null, fiiSell: null, diiBuy: null, diiSell: null,
  }));
}

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  try {
    const [latest, hist] = await Promise.allSettled([nseLatest().catch((e) => { cookie = null; if (!/skipped/.test(e.message)) nseFailAt = Date.now(); throw e; }), mcHistory()]);
    const rows = hist.status === 'fulfilled' ? hist.value : [];
    if (latest.status === 'fulfilled') {
      const l = latest.value, same = rows.find((r) => r.date === l.date);
      if (same) Object.assign(same, l); else rows.push(l);
    }
    if (!rows.length) throw new Error('FII/DII sources unavailable');
    rows.sort((a, b) => (a.date < b.date ? 1 : -1));
    res.status(200).json({
      ts: Date.now(),
      source: {
        latest: latest.status === 'fulfilled' ? 'NSE' : null,
        history: hist.status === 'fulfilled' ? 'Moneycontrol' : null,
      },
      data: rows,
    });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
