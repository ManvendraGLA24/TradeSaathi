// GET /api/candles?token=99926000&interval=FIVE_MINUTE -> historical candles
// (Option Apex chart). Defaults to NIFTY 50 5-minute.
import { candles } from './_smartapi.js';

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token') || '99926000';
    const exchange = (url.searchParams.get('exchange') || 'NSE').toUpperCase();
    const interval = url.searchParams.get('interval') || 'FIVE_MINUTE';
    const data = await candles(exchange, token, interval, 2);
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json({ ts: Date.now(), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
