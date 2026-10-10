// GET /api/indexmover -> NIFTY 50 level + each constituent's contribution in index points.
// points_i = weight_i Ã— %chg_i Ã— NIFTY prev close. Published weights drift a little each
// month, so the points are scaled to add up exactly to the real NIFTY change.
import { NIFTY50 } from '../api/_tokens.js';
import { quoteTokens } from '../api/_smartapi.js';

export default async function handler(req, res) {
  try {
    const [nifty] = await quoteTokens('NSE', [{ symbol: 'NIFTY 50', token: '99926000' }]);
    const q = await quoteTokens('NSE', NIFTY50.map(([symbol, token]) => ({ symbol, token })));
    if (nifty?.ltp == null || nifty?.change == null) throw new Error('NIFTY 50 quote is unavailable.');
    const quoted = q.filter((row) => row.ltp != null && row.pct != null);
    if (!quoted.length) throw new Error('NIFTY 50 constituent quotes are unavailable.');
    const prev = nifty.ltp - nifty.change;
    const niftyPct = nifty.pct ?? (prev > 0 ? +(nifty.change / prev * 100).toFixed(2) : null);
    const weights = new Map(NIFTY50.map(([symbol, , weight]) => [symbol, weight]));
    const rows = quoted.map((r) => ({ symbol: r.symbol, ltp: r.ltp, pct: r.pct, weight: weights.get(r.symbol),
      raw: (weights.get(r.symbol) / 100) * (r.pct / 100) * prev }));
    const sum = rows.reduce((s, r) => s + r.raw, 0);
    const ratio = sum ? nifty.change / sum : NaN;
    const scale = Math.abs(sum) > 1 && Number.isFinite(ratio) && ratio > 0.5 && ratio < 1.5 ? ratio : 1; // only calibrate small drift
    const data = rows.map(({ raw, ...r }) => ({ ...r, pts: +(raw * scale).toFixed(2) }))
      .sort((a, b) => Math.abs(b.pts) - Math.abs(a.pts));
    res.status(200).json({ ts: Date.now(), nifty: { ltp: nifty.ltp, change: nifty.change, pct: niftyPct, prevClose: +prev.toFixed(2) }, scale: +scale.toFixed(4), quotedCount: data.length, totalCount: NIFTY50.length, data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
