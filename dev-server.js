// Local dev server: serves the static app AND runs the /api/* functions with
// .env.local — the same code Vercel runs — so live data works locally.
// Usage: npm run dev   →  http://localhost:3000
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { attachMarketStream } from './lib/api/_marketStream.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/plain' };

// load .env.local (secrets stay on this machine)
const envFile = path.join(ROOT, '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
}

const handlers = {};
async function runApi(name, req, res) {
  const file = path.join(ROOT, 'api', name + '.js');
  const legacyFile = path.join(ROOT, 'lib', 'routes', name + '.js');
  const resolvedFile = fs.existsSync(file) ? file : (name.startsWith('_') ? null : legacyFile);
  if (!resolvedFile || !fs.existsSync(resolvedFile)) { res.statusCode = 404; return res.end('Not found'); }
  handlers[name] ||= (await import(pathToFileURL(resolvedFile).href)).default;
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
  await handlers[name](req, res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) return await runApi(url.pathname.slice(5).replace(/\/$/, ''), req, res);
    const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    res.statusCode = 500; res.end(String(e?.message || e));
  }
});
attachMarketStream(server);
server.listen(PORT, () => console.log(`TradeSaathi server → http://localhost:${PORT}  (private /api + Angel One stream)`));
