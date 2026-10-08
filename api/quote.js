// GET /api/quote?exchange=NSE&symbols=SBIN,RELIANCE,TATASTEEL
// Returns live quotes from Angel One SmartAPI. Credentials stay server-side.
import { quoteFull } from './_smartapi.js';

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    const exchange = (url.searchParams.get('exchange') || 'NSE').toUpperCase();
    const symbols = (url.searchParams.get('symbols') || '')
      .split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    if (!symbols.length) return res.status(400).json({ error: 'pass ?symbols=SBIN,RELIANCE' });

    const data = await quoteFull(exchange, symbols);
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=15');
    res.status(200).json({ exchange, ts: Date.now(), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
