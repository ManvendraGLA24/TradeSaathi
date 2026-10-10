const ROUTES = {
  candles: () => import('../lib/routes/candles.js'),
  fiidii: () => import('../lib/routes/fiidii.js'),
  indexmover: () => import('../lib/routes/indexmover.js'),
  indices: () => import('../lib/routes/indices.js'),
  insight: () => import('../lib/routes/insight.js'),
  news: () => import('../lib/routes/news.js'),
  oichange: () => import('../lib/routes/oichange.js'),
  optionchain: () => import('../lib/routes/optionchain.js'),
  portfolio: () => import('../lib/routes/portfolio.js'),
  quote: () => import('../lib/routes/quote.js'),
  universe: () => import('../lib/routes/universe.js'),
};

export default async function handler(req, res) {
  const url = new URL(req.url || '/', 'http://localhost');
  const name = decodeURIComponent(url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '') || 'universe');
  const loader = ROUTES[name];
  if (!loader) {
    res.statusCode = 404;
    return res.end('Not found');
  }

  const mod = await loader();
  const routeHandler = mod.default;
  if (!routeHandler || typeof routeHandler !== 'function') {
    res.statusCode = 500;
    return res.end('API route is misconfigured');
  }
  return routeHandler(req, res);
}
