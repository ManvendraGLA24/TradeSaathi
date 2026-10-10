// GET /api/candles?symbol=SBIN&range=6M   (or ?token=99926000 for an index)
// Historical candles for a stock/index. range: 1D | 1M | 6M | 1Y.
import { candles, resolveToken } from '../api/_smartapi.js';
import { requireSession } from '../api/_auth.js';
import { INDEX_TOKENS } from '../api/_tokens.js';

const RANGES = {
  '1D': { interval: 'FIVE_MINUTE', days: 5 }, // 5 days so weekends/holidays still give a prev session
  '1M': { interval: 'ONE_DAY', days: 31 },
  '6M': { interval: 'ONE_DAY', days: 183 },
  '1Y': { interval: 'ONE_DAY', days: 366 },
};

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  try {
    const q = new URL(req.url, 'http://localhost').searchParams;
    const exchange = (q.get('exchange') || 'NSE').toUpperCase();
    if (exchange !== 'NSE') return res.status(400).json({ error: 'Candles are currently supported for NSE instruments only.' });
    const key = RANGES[(q.get('range') || '').toUpperCase()] ? q.get('range').toUpperCase() : '1D';
    const { interval, days } = RANGES[key];
    let token = q.get('token');
    const symbol = (q.get('symbol') || '').trim().toUpperCase();
    if (token && !/^\d{1,12}$/.test(token)) return res.status(400).json({ error: 'Instrument token must be numeric.' });
    if (symbol && !/^[A-Z0-9&.-]{1,30}(?: [A-Z0-9&.-]{1,15})?$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid instrument symbol.' });
    }
    if (!token && symbol) token = INDEX_TOKENS[symbol] || (await resolveToken(exchange, symbol))?.symboltoken;
    if (!token && symbol) return res.status(404).json({ error: `No NSE instrument was found for ${symbol}.` });
    if (!token) token = INDEX_TOKENS['NIFTY 50'];
    let data = await candles(exchange, token, interval, days);
    let prevClose = null;
    if (key === '1D' && data.length) { // keep only the latest session; remember the previous close
      const day = String(data[data.length - 1][0]).slice(0, 10);
      const before = data.filter((r) => String(r[0]).slice(0, 10) !== day);
      prevClose = before.length ? before[before.length - 1][4] : null;
      data = data.filter((r) => String(r[0]).slice(0, 10) === day);
    }
    res.status(200).json({ ts: Date.now(), symbol: symbol || null, range: key, interval, prevClose, data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
