"use client";

/**
 * Market Pulse — "Breakout Beacon" live scanner (route: /market-pulse)
 * Rebuilt from Marketpulse01–07.png.
 *
 * Signals are sample/mock data wired through component state. Replace
 * `useSignals()` with a websocket / polling hook against your backend feed.
 * Set `rows = []` to see the faithful "Waiting on session prints" empty state.
 */

import { useState } from "react";
import shell from "@/components/ui/shell.module.css";
import s from "./mp.module.css";
import { PulseIcon } from "@/components/sidebar/icons";
import { PageHeader } from "@/components/ui/PageHeader";

type Signal = { sgn: "BUY" | "SELL"; symbol: string; pct: number; sgnPct: number; time: string };

// --- MOCK feed. Swap for a live hook. Set to [] for the empty state. ---
const SAMPLE: Signal[] = [
  { sgn: "BUY", symbol: "RELIANCE", pct: 2.41, sgnPct: 68, time: "10:14:22" },
  { sgn: "BUY", symbol: "TATAMOTORS", pct: 3.12, sgnPct: 61, time: "10:13:58" },
  { sgn: "SELL", symbol: "HDFCBANK", pct: -1.08, sgnPct: 54, time: "10:12:40" },
  { sgn: "BUY", symbol: "INFY", pct: 1.77, sgnPct: 49, time: "10:11:05" },
  { sgn: "SELL", symbol: "AXISBANK", pct: -0.92, sgnPct: 47, time: "10:09:33" },
];

const CANDLES = [
  { h: 22, c: "#ea3943" }, { h: 34, c: "#16c784" }, { h: 28, c: "#ea3943" },
  { h: 48, c: "#16c784" }, { h: 40, c: "#16c784" }, { h: 30, c: "#ea3943" },
];

export default function MarketPulsePage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [rows] = useState<Signal[]>(SAMPLE);

  return (
    <div className={shell.page}>
      <PageHeader icon={<PulseIcon size={22} />} title="Market Pulse" />

      {/* Hero */}
      <div className={s.hero}>
        <div className={s.candles}>
          {CANDLES.map((c, i) => (
            <span key={i} className={s.candle} style={{ height: c.h, background: c.c }} />
          ))}
        </div>
        <div className={s.heroText}>
          <h2>Breakout Beacon <span>💡</span></h2>
          <div className={s.heroMeta}>
            <PageHeaderInlineBadges />
          </div>
        </div>
        <div className={s.search}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
          </svg>
          <input placeholder="Search symbol" />
        </div>
      </div>

      {/* Toolbar: view toggle */}
      <div className={s.toolbar}>
        <div className={s.viewToggle}>
          <button className={`${s.vtBtn} ${view === "list" ? s.active : ""}`} onClick={() => setView("list")} aria-label="List view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button className={`${s.vtBtn} ${view === "grid" ? s.active : ""}`} onClick={() => setView("grid")} aria-label="Grid view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={s.filters}>
        <div className={s.select}>⇅ Neutral <span>▾</span></div>
        <div className={s.select}>◎ All <span>▾</span></div>
      </div>

      {/* Table */}
      <div className={shell.panel} style={{ overflow: "hidden" }}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>SGN</th><th>SYMBOL</th><th>%</th><th className={s.right}>SGN %</th><th className={s.right}>TIME</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className={s.empty}>
                    <h3>Waiting on session prints</h3>
                    <p>Signals fill as the tape builds. Check back in a few minutes.</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>
                  <td><span className={`${s.sgn} ${r.sgn === "BUY" ? s.sgnBuy : s.sgnSell}`}>{r.sgn === "BUY" ? "B" : "S"}</span></td>
                  <td className={s.sym}>{r.symbol}</td>
                  <td className={r.pct >= 0 ? s.up : s.down}>{r.pct >= 0 ? "+" : ""}{r.pct.toFixed(2)}%</td>
                  <td className={`${s.right} ${s.up}`}>{r.sgnPct}%</td>
                  <td className={s.time}>{r.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Small "How to use" + "LIVE" badges under the Breakout Beacon title. */
function PageHeaderInlineBadges() {
  return (
    <>
      <button className={shell.howto}>How to use <span className={shell.play}>▶</span></button>
      <span className={shell.live}>LIVE</span>
    </>
  );
}
