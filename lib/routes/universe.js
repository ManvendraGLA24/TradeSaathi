// GET /api/universe  -> live quotes for the whole scanner universe (one batch call).
// Powers Market Pulse / Gainers / Losers / High Power / Sector Scope on the client.
import { NSE_TOKENS } from '../api/_tokens.js';
import { quoteTokens } from '../api/_smartapi.js';
import { requireSession } from '../api/_auth.js';

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  try {
    const items = Object.entries(NSE_TOKENS).map(([symbol, token]) => ({ symbol, token }));
    const rows = await quoteTokens('NSE', items);
    // derive a simple momentum/activity score (R.FAC-like): |%chg| weighted by volume
    const maxVol = Math.max(1, ...rows.map((r) => r.volume || 0));
    const data = rows.map((r) => ({
      ...r,
      rfac: r.pct != null && r.volume != null ? +(Math.abs(r.pct) * (0.5 + 0.5 * (r.volume / maxVol)) * 100).toFixed(2) : null,
      turnover: r.ltp != null && r.volume != null ? +((r.ltp * r.volume) / 1e7).toFixed(2) : null, // â‚¹ Cr
      diff: r.ltp != null && r.close != null ? +(r.ltp - r.close).toFixed(2) : null,
    }));
    res.status(200).json({ ts: Date.now(), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
