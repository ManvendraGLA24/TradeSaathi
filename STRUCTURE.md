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
├── vercel.json           # longer timeouts for /api/optionchain and /api/oichange
├── .env.example          # list of required env vars (no secrets)
├── .env.local            # real secrets (gitignored)
├── STRUCTURE.md          # this file
│
├── api/                  # serverless functions. `_` prefix = shared helper, not a route
│   ├── _smartapi.js      # Angel One SmartAPI: TOTP login, session cache, throttle+retry,
│   │                     #   quotes, OI, candles, portfolio
│   ├── _tokens.js        # symbol→token maps: 39-stock universe, indices, NIFTY 50 (+ weights)
│   ├── _options.js       # NIFTY option contracts (one SmartAPI search, cached), OI + OI change
│   ├── _gemini.js        # Gemini helper (unused; search grounding needs a paid plan)
│   ├── quote.js          # /api/quote?symbols=SBIN,TCS     live quotes (watchlist)
│   ├── universe.js       # /api/universe                   all 39 stocks + rfac/turnover/diff
│   ├── indices.js        # /api/indices                    NIFTY 50 / BANK / FIN / IT / VIX
│   ├── optionchain.js    # /api/optionchain                strike-wise CE/PE OI, PCR
│   ├── oichange.js       # /api/oichange?from=09:15&to=15:30   OI change per strike in a time window
│   ├── indexmover.js     # /api/indexmover                 NIFTY 50 constituents + index points
│   ├── candles.js        # /api/candles?symbol=SBIN&range=1D|1M|6M|1Y   previous data
│   ├── portfolio.js      # /api/portfolio                  holdings/positions/trades P&L
│   ├── fiidii.js         # /api/fiidii                     30 days FII/DII (NSE + Moneycontrol)
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
| Quotes, OHLC, volume, OI, OI history, candles, positions | **Angel One SmartAPI** | key stays server-side |
| FII / DII | **NSE** (latest day, gross buy/sell) + **Moneycontrol** (~30 days, net) | SmartAPI has none |
| NIFTY 50 list / weights | **niftyindices.com** list + published weightage (as on 19-08-2026) | baked in `_tokens.js`; refresh monthly |
| News | **Economic Times RSS** | free, no key |

## Frontend pattern (every module)
1. Render mock immediately (useful on :5500 with no backend).
2. `apiFetch('/api/…')` — one shared, de-duplicated request per endpoint (reused 4s),
   so modules asking for the same data don't each hit SmartAPI.
3. If data arrives, merge and re-render; otherwise keep mock.
4. Live data loads **when a view is opened** (`onView`), and its poller runs only while open —
   browsers allow ~6 requests per host, so loading hidden modules would delay the visible one.

| Module | Endpoint(s) | Logic |
|---|---|---|
| Home | indices, news | live index ticker + market news |
| Watchlist | quote | W1–W5 saved lists (browser `localStorage`); 🗑 removes; click a name → previous data |
| Market Pulse | universe | gainers/losers by %chg; intraday/high-power by rfac; turnover; diff |
| Insider / Swing | universe | live %chg; heatmaps sized by \|%chg\|; Delivery shows live volume |
| Sector Scope | universe | `SECTOR_MAP` → sector score = avg %chg, heatmap, drill-down table |
| Index Mover | indexmover, candles | all 50 constituents; points = weight × %chg × NIFTY prev close, scaled to the real NIFTY move; today's NIFTY sparkline |
| FII / DII | fiidii | 30-day FII / DII / FII+DII charts; table with Prev/Next pages; NIFTY close per day |
| Option Clock | oichange | OI **change** per strike in the From→To window (Go button), net ΔOI, total-OI PCR |
| Option Apex | optionchain, universe, candles | today's 5-min NIFTY candles, live expiry, PCR + breadth gauges, money flux |
| Trading Journal | portfolio | today's stats; each day's P&L is saved in the browser and fills the tradebook heatmap + current-month calendar |

**Row actions (all scanner tables):** ★ saves the stock to the active watchlist; the chart
icon opens **previous data** — candles for 1D (latest session, change vs previous close),
1M, 6M, 1Y with last / prev close / period change / high / low / avg volume.

`rfac = |%chg| × (0.5 + 0.5 × volume ÷ max volume) × 100` (activity score).

## Not available (shown honestly in the UI)
- **Delivery %** — end-of-day data; NSE blocks it (403). Volume is shown live instead.
- **FII/DII gross buy/sell for past days** — only net flows are published in the history.
- **Past trades** — SmartAPI returns only today's trades; the journal builds history day by day in the browser.
- **Global indices** — SmartAPI covers Indian markets only.

## Scanner setup definitions (TradeFinder's exact rules are not public)
- **NR7** — narrowest high−low range of the last 7 sessions.
- **10 / 50 Day BO** — close above the highest high of the last 10 / 50 sessions.
- **Momentum spike** — % move on above-average volume.
- **Day H/L reversal** — new day high/low followed by a reversal.
- **Contraction BO** — breakout after shrinking ranges.
