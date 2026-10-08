// GET /api/news -> latest Indian market news from a public RSS feed (free, no key).
const FEED = 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms';
const UA = 'Mozilla/5.0 (compatible; TradeSaathi/1.0)';

const strip = (s) => String(s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').trim();
const tag = (block, t) => { const m = block.match(new RegExp('<' + t + '[^>]*>([\\s\\S]*?)<\\/' + t + '>', 'i')); return m ? strip(m[1]) : ''; };
function rel(dateStr) {
  const d = new Date(dateStr); if (isNaN(d)) return '';
  const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (s < 3600) return Math.round(s / 60) + 'm ago';
  if (s < 86400) return Math.round(s / 3600) + 'h ago';
  return Math.round(s / 86400) + 'd ago';
}

export default async function handler(req, res) {
  try {
    const r = await fetch(FEED, { headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/xml, text/xml' } });
    const xml = await r.text();
    const items = (xml.match(/<item[\s\S]*?<\/item>/gi) || []).slice(0, 12).map((block) => ({
      title: tag(block, 'title'),
      summary: tag(block, 'description').slice(0, 220),
      link: tag(block, 'link'),
      source: 'Economic Times',
      time: rel(tag(block, 'pubDate')),
    })).filter((x) => x.title);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    res.status(200).json({ ts: Date.now(), data: items });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
