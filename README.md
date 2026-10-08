# TradeSaathi — Sidebar Navigation

A production-ready, **data-driven** sidebar + top bar for the TradeSaathi
trading app. Rebranded from the TradeFinder reference design, built for
**Next.js (App Router) + React + TypeScript** with plain CSS Modules (no
Tailwind or icon-library required).

Market data is expected to come from **Angel One SmartAPI** via your own
backend — see "Premium gating & Angel One" below.

---

## 1. What's inside

```
src/components/sidebar/
├── index.ts              # barrel export
├── navConfig.ts          # ← EDIT THIS to change the menu (single source of truth)
├── Sidebar.tsx           # the sidebar shell (collapsible groups, lock states, active route)
├── Topbar.tsx            # notification bell + "SIGNED IN" user chip
├── Logo.tsx              # TradeSaathi wordmark + emblem
├── useSubscription.ts    # decides which premium items are locked (wire to your backend)
├── icons.tsx             # dependency-free inline SVG icons
├── types.ts              # TypeScript types for the config
└── Sidebar.module.css    # all styling (CSS variables at the top for theming)

preview.html              # open in any browser to SEE the design (no build needed)
```

> **Tip:** double-click `preview.html` first — it renders the exact look so
> you can eyeball it before integrating.

---

## 2. Quick start (Next.js App Router)

1. Copy the `src/components/sidebar/` folder into your project.
2. Add the shell to your dashboard layout:

```tsx
// app/(dashboard)/layout.tsx
"use client";
import { useState } from "react";
import { Sidebar, Topbar, useSubscription } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSubscription();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060910" }}>
      <Sidebar user={user} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Topbar user={user} notificationCount={3} onToggleMenu={() => setMenuOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

That's it — the menu renders from `navConfig.ts`, the active item highlights
automatically from the URL, and premium items lock based on `user.isSubscribed`.

---

## 3. Editing the menu

**You never touch the component markup.** Open `navConfig.ts` and edit the
array. Each entry is either a `leaf` (a link) or a `group` (collapsible).

```ts
// add a new free item
{ kind: "leaf", id: "alerts", label: "Alerts", href: "/alerts", icon: BellIcon },

// add a premium item inside the Stocks group
{ kind: "leaf", id: "fib-levels", label: "Fib Levels", href: "/fib-levels", icon: SwingIcon, premium: true },
```

- `premium: true` → shows the 🔒 lock and, for non-subscribers, routes to
  `/pricing?feature=<id>` instead of the page.
- `badge: "NEW"` → small pill next to the label.
- Each leaf's `id` matches the reference screenshots (e.g. `market-pulse` ↔
  `Marketpulse01.png`, `sector-scope` ↔ `SectorScope01.png`) so you can line
  the UI up with the design pack.

---

## 4. Premium gating & Angel One

Important separation of concerns:

| Concern | Where it lives |
|---|---|
| **Market data / orders** | Angel One SmartAPI (called from *your backend*, never the browser — your SmartAPI key/token must stay server-side) |
| **Who paid for TradeSaathi** | *Your own* backend (`/api/me` → `{ isSubscribed, plan, expiry }`) |
| **UI lock icon** | `useSubscription.ts` (visual hint only) |

Wire real subscription status by editing the `fetchMe()` function in
`useSubscription.ts` — the example call is already stubbed in comments. Keep
the returned shape (`SidebarUser`) the same and nothing else needs to change.

### ⚠️ Security note (do not skip)
The lock icon is **UI only**. A determined user can edit client state and
flip `isSubscribed`. **Access control must be enforced on the server** for
every premium route and every `/data/*` API endpoint — check the user's
subscription on the backend before returning Angel One data. Never rely on
the sidebar lock alone to protect paid features. (This is exactly the kind of
"client-side gating only" gap that leads to premium bypass.)

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

- `react`, `react-dom` (and `next` if you use the Next.js `Link`).
- **No** Tailwind, **no** icon library required.
- Optional: if you prefer `lucide-react`, delete `icons.tsx` and import the
  same-named icons from it.

---

## 8. Feature pages (the "inside" of each nav item)

All pages live under `src/app/(dashboard)/` and share the Sidebar+Topbar shell
(`layout.tsx`). Open **`preview_pages.html`** to see the three fully-built
pages (switch tabs at the top).

### Fully built (use these as your two reference patterns)
| Page | Route | Pattern | Rebuilt from |
|---|---|---|---|
| **Home** | `/` | dashboard: ticker + workspace + tool cards | `Home01/02.png` |
| **Market Pulse** | `/market-pulse` | hero + filters + live **table** (+ empty state) | `Marketpulse01–07.png` |
| **Sector Scope** | `/sector-scope` | sector **heatmap** (weighted tiles + tooltip) | `SectorScope01–15.png` |

### Scaffolded (navigable, ready to build out)
`swing-spectrum`, `insider-strategy`, `option-clock`, `option-apex`,
`index-mover`, `fii-dii`, `community`, `trading-journal`, `watchlist`,
`calculator`, `games/flip-it`, `games/trade-titans`, `videos/*`, `settings`,
`feedback`, `pricing`.

Each scaffold uses `<FeatureScaffold />` and names the screenshot(s) it should
match. To build one out, copy the closest reference page:
- **table-style** feature (Swing Spectrum, FII DII, Watchlist, Trading Journal) → copy `market-pulse/`.
- **heatmap-style** feature (Insider Strategy) → copy `sector-scope/` and reuse its `heat()` helper.
- **grid/chart** feature (Index Mover, Option Clock/Apex) → copy the Home grid + add charts.

### All data is mock
Every page renders placeholder data wired through component state. Replace the
`SAMPLE` / `MARKETS` / `SECTORS` constants with calls to **your backend**,
which holds the Angel One SmartAPI session server-side and enforces the
subscription check before returning `/data/*`. (Reminder from §4: the lock is
UI only — gate every premium endpoint on the server.)

### Files added for pages
```
src/app/(dashboard)/
├── layout.tsx                 # Sidebar + Topbar shell
├── page.tsx + home.module.css # Home
├── market-pulse/              # built  (table pattern)
├── sector-scope/              # built  (heatmap pattern)
└── <feature>/page.tsx         # scaffolds
src/components/ui/
├── shell.module.css           # shared tokens + page primitives
├── PageHeader.tsx             # title + How-to-use + LIVE row
└── FeatureScaffold.tsx        # placeholder for unbuilt pages
```

> **Path alias:** files import via `@/` (e.g. `@/components/sidebar`). Make sure
> your `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }` (default in a
> `src/`-based Next.js app).

