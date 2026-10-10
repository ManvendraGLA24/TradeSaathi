# TradeSaathi — Market Workspace

A private, single-user market dashboard with an Angel One SmartAPI backend,
real-time WebSocket quotes, historical candles, option-chain/OI endpoints, and
an on-demand Gemini market-summary route. It is analysis/display only and does
not place orders.

`npm run dev` serves `preview_pages.html` and the `/api/*` handlers from
`dev-server.js`. The TSX files under `src/app/` are source UI previews; this
repository does not currently configure a Next.js build.

---

## 1. What's inside

```
src/components/sidebar/
├── index.ts              # barrel export
├── navConfig.ts          # ← EDIT THIS to change the menu (single source of truth)
├── Sidebar.tsx           # the sidebar shell (collapsible groups and active route)
├── Topbar.tsx            # notification bell + "SIGNED IN" user chip
├── MobileNav.tsx         # responsive Stocks / Index / Home / Tools / More navigation
├── Logo.tsx              # TradeSaathi wordmark + emblem
├── useSubscription.ts    # sample signed-in user for the dashboard shell
├── icons.tsx             # dependency-free inline SVG icons
├── types.ts              # TypeScript types for the config
└── Sidebar.module.css    # all styling (CSS variables at the top for theming)

src/components/ui/StaticModulePage.tsx   # reusable static scanner/table/card layouts
src/components/ui/static-module.module.css

preview.html              # open in any browser to SEE the design (no build needed)
```

> **Tip:** double-click `preview.html` first — it renders the exact look so
> you can eyeball it before integrating.

---

## 2. Quick start

1. Keep `.env.local` private and fill in the server-side values from `.env.example`.
   Existing `.env.local` files are not overwritten.
2. Configure:
   - `APP_PASSWORD` — a unique dashboard password, at least 12 characters.
   - `APP_SESSION_SECRET` — a random secret of at least 32 characters.
   - `SMARTAPI_API_KEY`, `SMARTAPI_CLIENT_CODE`, `SMARTAPI_MPIN`, and
     `SMARTAPI_TOTP_SECRET` — your Angel One SmartAPI credentials.
   - `GEMINI_API_KEY` — optional; used only when the Gemini summary button is clicked.
3. Run `npm install`, then `npm run dev`, and open `http://localhost:3000`.
   Sign in with `APP_PASSWORD`.

The login uses an HttpOnly, SameSite cookie. All market, portfolio, news, and
Gemini API routes require this session. Never put broker or Gemini keys in
browser code.

For PowerShell, a secret can be generated in the local terminal with:

```powershell
$bytes = [byte[]]::new(32)
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
$rng.Dispose()
$secret
```

Use the output as `APP_SESSION_SECRET` in `.env.local`; choose a separate
`APP_PASSWORD` and never reuse the Angel One PIN.

## 3. Market-data and AI behavior

- Angel One SmartAPI REST provides NSE quotes, 5-minute/daily candle history,
  option-chain OI, and read-only portfolio statistics. FII/DII activity is
  daily public-source data from NSE and Moneycontrol, not Angel One account data
  or an intraday tick feed.
- The persistent Node server opens one authenticated Angel One WebSocket and
  broadcasts decoded quote ticks to signed-in browser sessions. A closed market,
  broker outage, expired credentials, or missing market subscription is shown
  as a disconnected/waiting state; sample prices are not substituted.
- Market Pulse, Sector Scope, Insider Strategy price/volume screens, Swing
  Spectrum, Watchlist, Index Mover, and Option Apex update from the live quote
  stream. Historical charts use Angel One candles; the current NIFTY candle is
  updated with stream ticks. Option OI change is based on SmartAPI's historical
  five-minute OI data, so it is not a tick-by-tick measure.
- FII/DII and news are fetched from their upstream public sources and are not
  tick data. Market commentary is explicitly requested from the Gemini button:
  the server supplies an Angel One snapshot, Google Search grounding is used for
  current public context, and returned web citations are shown. Gemini is not a
  live quote feed and does not issue trading instructions.
- Market-data modules show waiting/unavailable states instead of substituting
  old sample prices when a live quote or source response is missing.
- Scanner screens use price/volume rules over the available instrument set.
  SmartAPI quotes are not an insider-disclosure feed; Insider Strategy must not
  be interpreted as reporting actual insider transactions. No order-placement
  API is exposed.

### Deployment constraint

`/stream` requires a long-running Node process; Vercel serverless functions do
not host this WebSocket bridge. Deploy this app on an always-on Node host (for
example, a Render/Railway service or a VPS), run `npm start`, and set the same
environment variables there. Keep the app private and use HTTPS in production.
Do not expose a single-user broker account through an unauthenticated or
multi-user deployment.

### Deploy on Render

This repository includes a `render.yaml` Blueprint for the Node web service.
In Render, create a **Blueprint** from the GitHub repository and enter the
requested secret environment-variable values in Render's dashboard when
prompted. The YAML deliberately uses `sync: false`: never put real credentials
in `render.yaml`, source files, or GitHub. Keep `.env.local` local; it is
gitignored. `GEMINI_API_KEY` is optional; the other listed variables are needed
for private sign-in and SmartAPI data.

---

## 3. Editing the menu

**You never touch the component markup.** Open `navConfig.ts` and edit the
array. Each entry is either a `leaf` (a link) or a `group` (collapsible).

```ts
// add a new navigation item
{ kind: "leaf", id: "alerts", label: "Alerts", href: "/alerts", icon: BellIcon },
```

- `badge: "NEW"` → small pill next to the label.
- Each leaf's `id` matches the reference screenshots (e.g. `market-pulse` ↔
  `Marketpulse01.png`, `sector-scope` ↔ `SectorScope01.png`) so you can line
  the UI up with the design pack.

---

## 4. UI source

The `preview_pages.html` application is the served runtime and its market-data
screens are wired to the protected API and streaming service. The independent
React/TSX module pages are still illustrative UI source and are not built or
served by the current npm scripts.

---

## 5. Theming

All colors are CSS variables at the top of `Sidebar.module.css`:

```css
--ts-accent: #2dd4e8;   /* brand cyan — the "Trade" in the logo, active bar, upgrade button */
--ts-bg:     #0a0e17;   /* sidebar background */
--ts-text:   #d7dce8;   /* text */
/* ...etc */
```

Change them in one place (or override from your global theme) to retheme the
whole nav.

---

## 6. Using it WITHOUT Next.js

The only Next-specific bits are two imports in `Sidebar.tsx`:

```tsx
import Link from "next/link";                 // → replace with your <a> or router Link
import { usePathname } from "next/navigation"; // → replace with your router's current path
```

Swap those two lines for your framework's equivalent (React Router:
`Link` from `react-router-dom` + `useLocation().pathname`) and everything else
works unchanged.

---

## 7. Dependencies

- Node.js 20 or newer and `ws` for the persistent market-stream bridge.
- The TSX source additionally expects `react`, `react-dom`, and Next.js if you
  choose to configure/build it separately.
- **No** Tailwind, **no** icon library required.
- Optional: if you prefer `lucide-react`, delete `icons.tsx` and import the
  same-named icons from it.

---

## 8. Feature pages (the "inside" of each nav item)

The TSX UI pages live under `src/app/(dashboard)/` and share the Sidebar+Topbar
shell (`layout.tsx`). Open **`preview_pages.html`** to run the served dashboard.

### Current limitations

Only the static HTML dashboard is wired to the backend in this repository.
Community, games, videos, feedback, and settings remain presentation-only.
FII/DII freshness depends on the upstream publication schedule; Angel One data
availability and account entitlements determine which quotes/options are returned.

### Files added for pages
```
src/app/(dashboard)/
├── layout.tsx                 # Sidebar + Topbar shell
├── page.tsx + home.module.css # Home
├── market-pulse/              # scanner table preview
├── sector-scope/              # sector heatmap preview
└── <feature>/page.tsx         # module preview screens
src/components/ui/
├── shell.module.css           # shared tokens + page primitives
├── PageHeader.tsx             # title + How-to-use + LIVE row
├── StaticModulePage.tsx       # reusable cards, tables, metrics and chart bars
└── static-module.module.css   # responsive module preview styling
```

> **Path alias:** files import via `@/` (e.g. `@/components/sidebar`). Make sure
> your `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }` (default in a
> `src/`-based Next.js app).
