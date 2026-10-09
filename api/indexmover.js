// GET /api/indexmover -> NIFTY 50 level + each constituent's contribution in index points.
// points_i = weight_i × %chg_i × NIFTY prev close. Published weights drift a little each
// month, so the points are scaled to add up exactly to the real NIFTY change.
import { NIFTY50 } from './_tokens.js';
import { quoteTokens } from './_smartapi.js';

export default async function handler(req, res) {
  try {
    const [nifty] = await quoteTokens('NSE', [{ symbol: 'NIFTY 50', token: '99926000' }]);
    const q = await quoteTokens('NSE', NIFTY50.map(([symbol, token]) => ({ symbol, token })));
    const prev = nifty.ltp - nifty.change;
    const rows = q.map((r, i) => ({ symbol: r.symbol, ltp: r.ltp, pct: r.pct, weight: NIFTY50[i][2],
      raw: r.pct == null ? 0 : (NIFTY50[i][2] / 100) * (r.pct / 100) * prev }));
    const sum = rows.reduce((s, r) => s + r.raw, 0);
    const ratio = nifty.change / sum;
    const scale = Math.abs(sum) > 1 && ratio > 0.5 && ratio < 1.5 ? ratio : 1; // only calibrate small drift
    const data = rows.map(({ raw, ...r }) => ({ ...r, pts: +(raw * scale).toFixed(2) }))
      .sort((a, b) => Math.abs(b.pts) - Math.abs(a.pts));
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=15');
    res.status(200).json({ ts: Date.now(), nifty: { ltp: nifty.ltp, change: nifty.change, pct: nifty.pct, prevClose: +prev.toFixed(2) }, scale: +scale.toFixed(4), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
