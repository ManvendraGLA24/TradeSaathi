// GET /api/optionchain -> live NIFTY option chain OI (Option Clock / Option Apex).
import { optionChain } from '../api/_options.js';

export default async function handler(req, res) {
  try {
    const data = await optionChain(600);
    res.status(200).json({ ts: Date.now(), ...data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
