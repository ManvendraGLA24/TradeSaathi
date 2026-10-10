// GET /api/indices -> live NSE index levels (Home ticker / Index Mover).
import { INDEX_TOKENS } from '../api/_tokens.js';
import { quoteTokens } from '../api/_smartapi.js';

export default async function handler(req, res) {
  try {
    const items = Object.entries(INDEX_TOKENS).map(([symbol, token]) => ({ symbol, token }));
    const data = await quoteTokens('NSE', items);
    res.status(200).json({ ts: Date.now(), data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
