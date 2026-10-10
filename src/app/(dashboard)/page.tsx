"use client";

/**
 * Home dashboard (route: /)
 * Global Markets ticker + Workspace welcome card + Core tools grid.
 * Rebuilt from Home01.png / Home02.png, rebranded to TradeSaathi.
 *
 * Market data (indices, % change) is placeholder here — replace MARKETS and
 * the ticker with a live feed from your backend (which talks to Angel One
 * SmartAPI server-side).
 */

import Link from "next/link";
import shell from "@/components/ui/shell.module.css";
import s from "./home.module.css";
import { useSubscription } from "@/components/sidebar";
import {
  PulseIcon, StrategyIcon, SectorIcon, SwingIcon, ClockIcon, ApexIcon,
} from "@/components/sidebar/icons";

const MARKETS = [
  { tag: "30", name: "DOW JONES", price: "50,692.00", chg: "-451.00 (-0.88%)", dir: "down" },
  { tag: "225", name: "NIKKEI", price: "68,778", chg: "-878.00 (-1.26%)", dir: "down" },
  { tag: "₿", name: "BTC/USD", price: "82,423.83", chg: "-902.68 (-1.08%)", dir: "down" },
  { tag: "HSI", name: "HSI", price: "23,785.79", chg: "-344.71 (-1.43%)", dir: "down" },
  { tag: "DAX", name: "DAX", price: "25,104.36", chg: "-344.83 (-1.35%)", dir: "down" },
];

const TOOLS = [
  { href: "/market-pulse", title: "Market Pulse", icon: PulseIcon, color: "#ea3943",
    desc: "Live scanners for high power, breakouts, gainers, losers, and delivery action across the cash market." },
  { href: "/insider-strategy", title: "Insider Strategy", icon: StrategyIcon, color: "#f5a623",
    desc: "Heatmap of insider-style setups so you can spot concentrated buying and selling patterns fast." },
  { href: "/sector-scope", title: "Sector Scope", icon: SectorIcon, color: "#16c784",
    desc: "Compare sector strength, breadth, and the stocks leading each move in one desk view." },
  { href: "/swing-spectrum", title: "Swing Spectrum", icon: SwingIcon, color: "#4f8cff",
    desc: "Swing ideas from breakouts, NR7, and weekly structures built for multi-day holds." },
  { href: "/option-clock", title: "Option Clock", icon: ClockIcon, color: "#2dd4e8",
    desc: "Track call and put OI change by strike and time window to read build-up through the session." },
  { href: "/option-apex", title: "Option Apex", icon: ApexIcon, color: "#f2c94c",
    desc: "Candle-by-candle option flow with sentiment context for timing entries and exits." },
];

export default function HomePage() {
  const { user } = useSubscription();

  return (
    <div className={`${shell.page} ${s.home}`}>
      {/* Global Markets */}
      <section className={s.hero}>
        <h2>Global Markets</h2>
        <p>
          Global stock market movements impact investor sentiment and confidence in the Indian
          stock market. Positive trends in major global indices often lead to increased investor
          optimism, driving up demand for Indian stocks and vice versa.
        </p>
        <div className={s.ticker}>
          {MARKETS.map((m) => (
            <div className={s.tick} key={m.name}>
              <div className={s.tickTop}>
                <span className={s.tickBadge}>{m.tag}</span>
                {m.name}
              </div>
              <div className={s.tickPrice}>{m.price}</div>
              <div className={`${s.tickChg} ${m.dir === "down" ? s.down : s.up}`}>{m.chg}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Workspace card */}
      <section className={s.workspace}>
        <div>
          <div className={s.wsLabel}>TRADESAATHI WORKSPACE</div>
          <h3>Welcome, {user.displayName}</h3>
          <p>Scanners, flow, and setups — one workspace for the session.</p>
        </div>
        <div className={s.wsBtns}>
          <Link href="/videos/tutorials" className={`${s.wsBtn} ${s.wsBtnPrimary}`}>📺 FAQ Videos</Link>
          <Link href="/settings" className={`${s.wsBtn} ${s.wsBtnGhost}`}>Settings</Link>
        </div>
      </section>

      {/* Core tools */}
      <div className={shell.sectionTitle}>
        <span className={shell.dot} /> Core tools <small>Daily stack</small>
      </div>
      <div className={s.grid}>
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className={s.card}>
              <div className={s.cardIcon} style={{ background: `${t.color}1f`, color: t.color }}>
                <Icon size={24} />
              </div>
              <h4>{t.title}</h4>
              <p>{t.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
