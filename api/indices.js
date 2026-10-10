// GET /api/indices -> live NSE index levels (Home ticker / Index Mover).
import { INDEX_TOKENS } from './_tokens.js';
import { quoteTokens } from './_smartapi.js';
import { requireSession } from './_auth.js';

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  try {
    const items = Object.entries(INDEX_TOKENS).map(([symbol, token]) => ({ symbol, token }));
    const data = await quoteTokens('NSE', items);
    res.status(200).json({ ts: Date.now(), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
