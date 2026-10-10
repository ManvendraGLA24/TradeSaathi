// GET /api/quote?exchange=NSE&symbols=SBIN,RELIANCE,TATASTEEL
// Returns live quotes from Angel One SmartAPI. Credentials stay server-side.
import { quoteFull } from '../api/_smartapi.js';
import { requireSession } from '../api/_auth.js';

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  try {
    const url = new URL(req.url, 'http://localhost');
    const exchange = (url.searchParams.get('exchange') || 'NSE').toUpperCase();
    if (!['NSE', 'NFO', 'BSE', 'MCX'].includes(exchange)) {
      return res.status(400).json({ error: 'Unsupported exchange.' });
    }
    const symbols = (url.searchParams.get('symbols') || '')
      .split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    if (!symbols.length) return res.status(400).json({ error: 'pass ?symbols=SBIN,RELIANCE' });
    if (symbols.length > 50 || symbols.some((symbol) => !/^[A-Z0-9&.-]{1,30}$/.test(symbol))) {
      return res.status(400).json({ error: 'Pass up to 50 valid instrument symbols.' });
    }

    const data = await quoteFull(exchange, symbols);
    if (!data.length) return res.status(404).json({ error: 'No matching instruments were found.' });
    res.status(200).json({ exchange, ts: Date.now(), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
