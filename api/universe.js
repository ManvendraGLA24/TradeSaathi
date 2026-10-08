// GET /api/universe  -> live quotes for the whole scanner universe (one batch call).
// Powers Market Pulse / Gainers / Losers / High Power / Sector Scope on the client.
import { NSE_TOKENS } from './_tokens.js';
import { quoteTokens } from './_smartapi.js';

export default async function handler(req, res) {
  try {
    const items = Object.entries(NSE_TOKENS).map(([symbol, token]) => ({ symbol, token }));
    const rows = await quoteTokens('NSE', items);
    // derive a simple momentum/activity score (R.FAC-like): |%chg| weighted by volume
    const maxVol = Math.max(1, ...rows.map((r) => r.volume || 0));
    const data = rows.map((r) => ({
      ...r,
      rfac: r.pct != null ? +(Math.abs(r.pct) * (0.5 + 0.5 * ((r.volume || 0) / maxVol)) * 100).toFixed(2) : 0,
      turnover: r.ltp && r.volume ? +((r.ltp * r.volume) / 1e7).toFixed(2) : 0, // ₹ Cr
      diff: r.ltp != null && r.close != null ? +(r.ltp - r.close).toFixed(2) : 0,
    }));
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=15');
    res.status(200).json({ ts: Date.now(), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
