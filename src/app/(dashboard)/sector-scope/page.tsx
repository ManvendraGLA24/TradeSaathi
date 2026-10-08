"use client";

/**
 * Sector Scope — sector heatmap (route: /sector-scope)
 * Rebuilt from SectorScope01–15.png.
 *
 * Each sector shows its constituents as tiles colored by % change (green up /
 * red down) and sized by index weight. Data below is mock — replace SECTORS
 * with a live snapshot from your backend (Angel One quotes, server-side).
 */

import { useState } from "react";
import shell from "@/components/ui/shell.module.css";
import s from "./ss.module.css";
import { SectorIcon } from "@/components/sidebar/icons";
import { PageHeader } from "@/components/ui/PageHeader";

type Stock = { sym: string; pct: number; size?: "big" | "mid" };
type Sector = { name: string; stocks: Stock[] };

/** Map a % change to a red→green heat color. */
function heat(pct: number) {
  const clamped = Math.max(-3, Math.min(3, pct));
  if (clamped >= 0) {
    const a = 0.25 + (clamped / 3) * 0.6;
    return `rgba(22,199,132,${a.toFixed(2)})`;
  }
  const a = 0.25 + (Math.abs(clamped) / 3) * 0.6;
  return `rgba(234,57,67,${a.toFixed(2)})`;
}

const mk = (syms: [string, number, ("big" | "mid")?][]): Stock[] =>
  syms.map(([sym, pct, size]) => ({ sym, pct, size }));

const SECTORS: Sector[] = [
  { name: "NIFTYPSUBANK", stocks: mk([["MARUTI", 1.9, "big"], ["AXISBANK", -1.2, "mid"], ["ONGC", -0.8, "mid"], ["HINDUNILVR", -0.5], ["TATAS", 0.9], ["TCS", -0.6], ["WIPRO", 0.4], ["KOTAKBANK", -0.7], ["UPL", -1.1], ["ASIANPAINT", -0.9]]) },
  { name: "CNXREALTY", stocks: mk([["MARUTI", 1.4, "mid"], ["AXISB", -1.0], ["ONGC", -0.7], ["UPL", -1.2, "mid"], ["HI", -0.4], ["TCS", -0.5], ["K", 0.3], ["ASIANPAI", -0.8], ["TATAS", 0.6], ["W", 0.2]]) },
  { name: "BANKNIFTY", stocks: mk([["MARUTI", 1.2, "mid"], ["UPL", -1.0], ["ASI", -0.6], ["AXISB", -0.9], ["HI", -0.4], ["TCS", -0.5], ["K", 0.3], ["ONGC", -0.7], ["TATA", 0.5], ["WI", 0.2]]) },
  { name: "CNXENERGY", stocks: mk([["MARUTI", 1.6, "big"], ["AXISB", -1.1, "mid"], ["ONGC", -0.8], ["HIN", -0.5], ["UPL", -1.3], ["TCS", -0.6], ["TAT", 0.7], ["WI", 0.3], ["ASIANPAINT", -0.9, "mid"], ["KOTAKBANK", -0.7, "mid"]]) },
  { name: "NIFTYFINSERVICE", stocks: mk([["MARUTI", 1.3, "big"], ["UPL", -1.0], ["AS", -0.6], ["AXISBA", -0.9, "mid"], ["TCS", -0.5], ["KO", 0.3], ["ONGC", -0.7], ["TATA", 0.6], ["HINDUN", -0.5], ["WIPRO", 0.4]]) },
  { name: "Nifty 50", stocks: mk([["MARUTI", 1.5, "mid"], ["UPL", -1.1, "mid"], ["ASI", -0.6], ["AX", -0.9], ["O", -0.7], ["HIND", -0.5], ["KO", 0.3], ["TA", 0.6], ["TCS", -0.5], ["WI", 0.2]]) },
  { name: "NIFTYPVTBANK", stocks: mk([["MARUTI", 1.1, "mid"], ["UPL", -1.0, "mid"], ["AS", -0.6], ["A", -0.4], ["ON", -0.7], ["HINDU", -0.5], ["TA", 0.6], ["TCS", -0.5], ["KOTAK", -0.7], ["WI", 0.2]]) },
  { name: "NIFTYFMCG", stocks: mk([["MARUTI", 1.7, "big"], ["ASIANPAINT", -0.9, "mid"], ["HIND", -0.5], ["TCS", -0.6], ["AXISBANK", -1.0, "mid"], ["KOTAKB", -0.7], ["W", 0.3], ["UPL", -1.2], ["ONGC", -0.7], ["TATASTEEL", 0.8, "mid"]]) },
  { name: "NIFTYMEDIA", stocks: mk([["MARUTI", 1.2, "mid"], ["ASIANP", -0.8], ["HI", -0.4], ["TC", -0.5], ["K", 0.3], ["AXISBA", -0.9, "mid"], ["UPL", -1.0], ["ONGC", -0.7], ["TA", 0.6], ["W", 0.2]]) },
  { name: "NIFTYMETAL", stocks: mk([["MARUTI", 1.0], ["ASI", -0.6], ["ON", -0.7], ["TCS", -0.5], ["TA", 0.6], ["UPL", -1.0], ["AXI", -0.9], ["HI", -0.4], ["K", 0.3], ["W", 0.2]]) },
  { name: "CNXPHARMA", stocks: mk([["MA", 1.1, "mid"], ["UP", -1.0, "mid"], ["AS", -0.6], ["O", -0.7]]) },
  { name: "CNXIT", stocks: mk([["MA", 1.0, "mid"], ["UP", -1.1, "mid"], ["TCS", -0.5], ["WI", 0.3]]) },
];

export default function SectorScopePage() {
  const [tip, setTip] = useState<{ x: number; y: number; sym: string; pct: number } | null>(null);

  return (
    <div className={shell.page}>
      <PageHeader
        icon={<SectorIcon size={22} />}
        title="Sector Scope"
        howto
        live
        right={
          <div className={s.legend}>
            Down <span className={s.legendBar} /> Up
          </div>
        }
      />

      <div className={s.board}>
        {SECTORS.map((sec) => (
          <div className={s.sector} key={sec.name}>
            <div className={s.sectorName}>{sec.name}</div>
            <div className={s.tiles}>
              {sec.stocks.map((st, i) => (
                <div
                  key={i}
                  className={`${s.tile} ${st.size === "big" ? s.big : st.size === "mid" ? s.mid : ""}`}
                  style={{ background: heat(st.pct) }}
                  onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, sym: st.sym, pct: st.pct })}
                  onMouseLeave={() => setTip(null)}
                >
                  {st.sym}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tip && (
        <div className={s.tip} style={{ left: tip.x, top: tip.y }}>
          <div className={s.tipSym}>{tip.sym}</div>
          <div className={s.tipPct} style={{ color: tip.pct >= 0 ? "var(--up)" : "var(--down)" }}>
            % chg: {tip.pct >= 0 ? "+" : ""}{tip.pct.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
