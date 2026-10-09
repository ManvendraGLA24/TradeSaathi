# TradeSaathi — Project Structure & Data Logic

A trading dashboard. The **frontend** is one static page (`preview_pages.html`) that
renders instantly with mock data and switches to **live data** as soon as the `/api`
functions answer. The `/api` functions run on Vercel (or locally via `npm run dev`).
Secrets live only in `.env.local` / Vercel env — never in the browser or git.

```
tradesaathi-navbar/
├── index.html            # redirect → preview_pages.html ("/" serves the app)
├── preview_pages.html    # THE APP: sidebar + every module view + inline JS
├── dev-server.js         # local server: static app + /api functions (npm run dev)
├── package.json          # "type": "module", script "dev"
├── vercel.json           # longer timeout for /api/optionchain
├── .env.example          # list of required env vars (no secrets)
├── .env.local            # real secrets (gitignored)
├── STRUCTURE.md          # this file
│
├── api/                  # serverless functions. `_` prefix = shared helper, not a route
│   ├── _smartapi.js      # Angel One SmartAPI: TOTP login, session cache, throttle+retry,
│   │                     #   quotes, OI, candles, portfolio
│   ├── _tokens.js        # baked NSE symbol→token map (39-stock universe) + index tokens
│   ├── _options.js       # NIFTY option chain from the SmartAPI scrip master (cached)
│   ├── _gemini.js        # Gemini helper (unused; search grounding needs a paid plan)
│   ├── quote.js          # /api/quote?symbols=SBIN,TCS     live quotes (watchlist)
│   ├── universe.js       # /api/universe                   all 39 stocks + rfac/turnover/diff
│   ├── indices.js        # /api/indices                    NIFTY 50 / BANK / FIN / IT / VIX
│   ├── optionchain.js    # /api/optionchain                strike-wise CE/PE OI, PCR
│   ├── candles.js        # /api/candles?symbol=SBIN&range=1D|1M|6M|1Y   previous data
│   ├── portfolio.js      # /api/portfolio                  holdings/positions/trades P&L
│   ├── fiidii.js         # /api/fiidii                     FII/DII from NSE
│   └── news.js           # /api/news                       Economic Times RSS
│
└── src/                  # Next.js React scaffold (reference only)
```

## Run it
| Where | How | Data |
|---|---|---|
| Local, live | `npm run dev` → http://localhost:3000 | real (uses `.env.local`) |
| Local, quick look | Live Server on `preview_pages.html` (:5500) | mock (no `/api`) |
| Production | Vercel, with the `SMARTAPI_*` env vars set | real |

## Data sources
| Need | Source | Note |
|---|---|---|
| Quotes, OHLC, volume, OI, candles, positions | **Angel One SmartAPI** | key stays server-side |
| FII / DII | **NSE** `fiidiiTradeReact` | SmartAPI has none; NSE gives only the latest day |
| News | **Economic Times RSS** | free, no key |

## Frontend pattern (every module)
1. Render mock immediately.
2. `apiFetch('/api/…')` — one shared, de-duplicated request per endpoint (reused 4s),
   so modules asking for the same data don't each hit SmartAPI.
3. If data arrives, merge and re-render; otherwise keep mock.
4. A poller refreshes only while that view is open.

| Module | Endpoint(s) | Logic |
|---|---|---|
| Home | indices, news | live index ticker + market news |
| Watchlist | quote | W1–W5 saved lists (browser `localStorage`); 🗑 removes; click a name → previous data |
| Market Pulse | universe | gainers/losers by %chg; intraday/high-power by rfac; turnover; diff |
| Insider / Swing | universe | live %chg; heatmaps sized by \|%chg\|; Delivery shows live volume |
| Sector Scope | universe | `SECTOR_MAP` → sector score = avg %chg, heatmap, drill-down table |
| Index Mover | universe, indices | live NIFTY 50 + drivers ranked by %chg (weights not public) |
| FII / DII | fiidii | latest real FII/DII row + chart bar |
| Option Clock | optionchain | CE (bears) / PE (bulls) OI per strike, ATM, net position, PCR |
| Option Apex | optionchain, universe, candles | live NIFTY candles, PCR + breadth gauges, money flux |
| Trading Journal | portfolio | P&L stats from the account's positions/trades |

**Row actions (all scanner tables):** ★ saves the stock to the active watchlist; the chart
icon opens **previous data** — candles for 1D (latest session, change vs previous close),
1M, 6M, 1Y with last / prev close / period change / high / low / avg volume.

`rfac = |%chg| × (0.5 + 0.5 × volume ÷ max volume) × 100` (activity score).

## Not available (shown honestly in the UI)
- **Delivery %** — end-of-day data; NSE blocks it (403). Volume is shown live instead.
- **FII/DII history** — NSE returns only the latest day; history needs a database.
- **Global indices** — SmartAPI covers Indian markets only.

## Scanner setup definitions (TradeFinder's exact rules are not public)
- **NR7** — narrowest high−low range of the last 7 sessions.
- **10 / 50 Day BO** — close above the highest high of the last 10 / 50 sessions.
- **Momentum spike** — % move on above-average volume.
- **Day H/L reversal** — new day high/low followed by a reversal.
- **Contraction BO** — breakout after shrinking ranges.
