// Gemini helper (server-side). Uses Google Search grounding for live public data
// (FII/DII, news) that SmartAPI doesn't provide. Key stays server-side.
const MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function gemini(prompt, { search = false } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  if (search) body.tools = [{ google_search: {} }];
  let failure = 'no response';
  for (const model of MODELS) {
    for (let i = 0; i < 2; i++) {
      let res;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(15000),
        });
      } catch (error) {
        failure = error.name === 'TimeoutError' ? 'request timed out' : 'network request failed';
        break;
      }
      const j = await res.json().catch(() => null);
      if (res.status === 503 || res.status === 429) {
        failure = `HTTP ${res.status}`;
        await sleep(900);
        continue;
      }
      const candidate = j?.candidates?.[0];
      const text = (candidate?.content?.parts || []).map((p) => p.text).filter(Boolean).join('');
      if (res.ok && text) {
        const sources = (candidate.groundingMetadata?.groundingChunks || [])
          .map((chunk) => chunk.web)
          .filter((web) => web?.uri)
          .map((web) => ({ title: web.title || web.uri, url: web.uri }));
        return { text, sources };
      }
      failure = j?.error?.message || `HTTP ${res.status}`;
      break; // non-retryable error for this model -> try next model
    }
  }
  throw new Error(`Gemini request failed: ${failure}`);
}

export function parseJSON(text) {
  let t = String(text || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(t); } catch { /* try to extract */ }
  const m = t.match(/[\[{][\s\S]*[\]}]/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* give up */ } }
  return null;
}
