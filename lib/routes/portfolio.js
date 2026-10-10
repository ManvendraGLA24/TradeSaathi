// GET /api/portfolio -> Trading Journal stats from the account's live holdings,
// positions and today's trades (SmartAPI). Empty account => zeros.
import { portfolio } from '../api/_smartapi.js';
import { requireSession } from '../api/_auth.js';

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  try {
    const data = await portfolio();
    res.status(200).json({ ts: Date.now(), ...data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
