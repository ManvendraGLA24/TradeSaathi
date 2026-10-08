// GET /api/optionchain -> live NIFTY option chain OI (Option Clock / Option Apex).
import { optionChain } from './_options.js';

export default async function handler(req, res) {
  try {
    const data = await optionChain(600);
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=40');
    res.status(200).json({ ts: Date.now(), ...data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
