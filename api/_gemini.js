// Gemini helper (server-side). Uses Google Search grounding for live public data
// (FII/DII, news) that SmartAPI doesn't provide. Key stays server-side.
const MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function gemini(prompt, { search = false } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  if (search) body.tools = [{ google_search: {} }];
  for (const model of MODELS) {
    for (let i = 0; i < 2; i++) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      }).catch(() => null);
      if (!res) break;
      if (res.status === 503 || res.status === 429) { await sleep(900); continue; }
      const j = await res.json().catch(() => null);
      const text = (j?.candidates?.[0]?.content?.parts || []).map((p) => p.text).filter(Boolean).join('');
      if (res.status === 200 && text) return text;
      break; // non-retryable error for this model -> try next model
    }
  }
  throw new Error('Gemini request failed');
}

export function parseJSON(text) {
  let t = String(text || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(t); } catch { /* try to extract */ }
  const m = t.match(/[\[{][\s\S]*[\]}]/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* give up */ } }
  return null;
}
