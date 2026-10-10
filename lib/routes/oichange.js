// GET /api/oichange?from=09:15&to=15:30 -> per-strike OI change (CE = bears,
// PE = bulls) inside that window of the latest session. Powers the OI Clock.
import { oiChange } from '../api/_options.js';
import { requireSession } from '../api/_auth.js';

const hhmm = (v, d) => (/^\d{2}:\d{2}$/.test(v || '') ? v : d);

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  try {
    const q = new URL(req.url, 'http://localhost').searchParams;
    const data = await oiChange(hhmm(q.get('from'), '09:15'), hhmm(q.get('to'), '15:30'));
    res.status(200).json({ ts: Date.now(), ...data });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
