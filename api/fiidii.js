// GET /api/fiidii -> latest FII/FPI & DII provisional cash-market activity (₹ Cr),
// scraped directly from NSE (accurate, free). NSE needs a cookie from its homepage first.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
let cookie = null, cookieAt = 0;

async function getCookie() {
  if (cookie && Date.now() - cookieAt < 10 * 60 * 1000) return cookie;
  const r = await fetch('https://www.nseindia.com/', {
    headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9' },
  });
  const list = r.headers.getSetCookie ? r.headers.getSetCookie() : [r.headers.get('set-cookie')].filter(Boolean);
  cookie = list.map((c) => c.split(';')[0]).join('; ');
  cookieAt = Date.now();
  return cookie;
}

export default async function handler(req, res) {
  try {
    const ck = await getCookie();
    const r = await fetch('https://www.nseindia.com/api/fiidiiTradeReact', {
      headers: { 'User-Agent': UA, 'Accept': 'application/json, text/plain, */*', 'Accept-Language': 'en-US,en;q=0.9', 'Referer': 'https://www.nseindia.com/reports/fii-dii', 'Cookie': ck },
    });
    const arr = await r.json();
    const num = (v) => (v != null && v !== '' ? +String(v).replace(/,/g, '') : null);
    const fii = arr.find((x) => /FII|FPI/i.test(x.category)) || {};
    const dii = arr.find((x) => /DII/i.test(x.category)) || {};
    const row = {
      date: fii.date || dii.date,
      fiiBuy: num(fii.buyValue), fiiSell: num(fii.sellValue), fiiNet: num(fii.netValue),
      diiBuy: num(dii.buyValue), diiSell: num(dii.sellValue), diiNet: num(dii.netValue),
    };
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    res.status(200).json({ source: 'NSE', ts: Date.now(), data: [row] });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
