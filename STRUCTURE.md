# TradeSaathi — Project Structure & Data Logic

A trading dashboard. **Frontend** is one static page (`preview_pages.html`) that works
on its own (mock data) and auto-upgrades to **live data** when the `/api` serverless
functions are reachable (on Vercel). Secrets live only in `.env.local` / Vercel env.

```
tradesaathi-navbar/
├── index.html              # redirect → preview_pages.html (so "/" serves the app on Vercel)
├── preview_pages.html      # THE APP: sidebar + all module views + inline JS (mock + live wiring)
├── preview.html            # old sidebar-only mockup (reference)
├── package.json            # { "type": "module" } — marks /api as ESM Node functions
├── .env.example            # template of required env vars (NO secrets)
├── .env.local              # real secrets (gitignored, never pushed)
│
├── api/                    # Vercel serverless functions (Node). `_`-prefixed = helper, not a route.
│   ├── _smartapi.js        # Angel One SmartAPI client: TOTP login, session cache,
│   │                       #   throttle+retry (rate limits), quoteTokens/quoteFull
│   ├── _tokens.js          # baked NSE symbol→token map (39 stocks = the scanner universe)
│   ├── _gemini.js          # Gemini helper (kept; search grounding needs a paid plan)
│   ├── quote.js            # GET /api/quote?symbols=SBIN,RELIANCE → live quotes
│   ├── universe.js         # GET /api/universe → batch quotes for all 39 + rfac/turnover/diff
│   ├── fiidii.js           # GET /api/fiidii → real FII/DII from NSE (cookie bootstrap)
│   └── news.js             # GET /api/news → market news from Economic Times RSS
│
└── src/                    # Next.js React scaffold (reference; the live app is preview_pages.html)
```

## Data sources
| Need | Source | Why |
|---|---|---|
| Live quotes / OHLC / volume | **Angel One SmartAPI** | broker real-time feed (key server-side) |
| FII / DII | **NSE** `fiidiiTradeReact` | SmartAPI has no FII/DII; NSE is official + free |
| Market news | **Economic Times RSS** | free, reliable; no key |
| (optional) summaries | Gemini | only if billing enabled for search grounding |

## How each module gets real-time data
All frontend modules follow one pattern: **render mock immediately → fetch `/api/*` →
if data, merge + re-render; else keep mock.** A per-view poller refreshes while that view is open.

| Module | Endpoint | Logic |
|---|---|---|
| Watchlist | `/api/quote` | live LTP, %chg, day range per saved symbol |
| Market Pulse | `/api/universe` | scanners = universe sorted by %chg (gainers/losers), rfac (intraday/high-power), turnover, diff. `rfac = |%chg| × volume-weight` |
| Sector Scope | `/api/universe` | `SECTOR_MAP` groups universe → sector score = avg %chg; heatmap tiles = stock %chg; detail = sector's stocks |
| FII / DII | `/api/fiidii` | latest real FII/DII buy/sell/net (₹ Cr) |
| Insider / Swing scanners | `/api/universe` (+ candles) | live %chg now; setup filters (below) need daily candles |
| Index Mover | `/api/universe` + index | per-stock points ≈ %chg × weight (weights approximate) |
| Option Clock / Apex | option-chain OI | strike-wise OI (heavy — option tokens) |
| Trading Journal | SmartAPI positions | today's realised/unrealised P&L |

## Scanner setup definitions (standard; TradeFinder's exact rules are proprietary)
- **NR7** — day with the narrowest high−low range of the last 7 sessions.
- **10 / 50 Day BO** — price closes above the highest high of the last 10 / 50 sessions.
- **Momentum Spike (5/10 min)** — % move on volume above its average.
- **Day H/L Reversal** — price makes a new day high/low then reverses.
- **Contraction BO** — breakout after a volatility contraction (shrinking ranges).
- **Delivery %** — delivered qty ÷ traded qty (from NSE; not in SmartAPI).

> Setup filters that need history use SmartAPI historical candles (`getCandleData`),
> computed server-side and cached (daily setups change once/day).
