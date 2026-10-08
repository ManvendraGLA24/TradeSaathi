// GET /api/portfolio -> Trading Journal stats from the account's live holdings,
// positions and today's trades (SmartAPI). Empty account => zeros.
import { portfolio } from './_smartapi.js';

export default async function handler(req, res) {
  try {
    const data = await portfolio();
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    res.status(200).json({ ts: Date.now(), ...data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
