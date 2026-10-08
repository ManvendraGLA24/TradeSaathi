"use client";

/**
 * Calculator — a card-style tool with five sub-calculators:
 *   Risk / Position Size · CAGR · SIP · EMI · Option P&L
 *
 * Matches the reference design: outer card → tab row → inner form pane
 * (labelled inputs + Clear/Calculate) → Result block. All maths runs
 * client-side; no backend needed.
 */

import { useState, type ReactNode } from "react";
import shell from "@/components/ui/shell.module.css";
import css from "./calc.module.css";
import { PageHeader } from "@/components/ui/PageHeader";
import { CalculatorIcon } from "@/components/sidebar/icons";

type TabId = "risk" | "cagr" | "sip" | "emi" | "charges";

const TABS: { id: TabId; label: string; ico: string }[] = [
  { id: "risk", label: "Risk", ico: "🎯" },
  { id: "cagr", label: "CAGR", ico: "📕" },
  { id: "sip", label: "SIP", ico: "🎁" },
  { id: "emi", label: "EMI", ico: "🧮" },
  { id: "charges", label: "Charges", ico: "🧾" },
];

/* Indian-market charge rates per segment (NSE; current statutory rates).
   stt side: "sell" = sell-side only, "both" = buy + sell. Values are fractions. */
const CSEG = [
  { k: "options", label: "Options", stt: 0.001, side: "sell", txn: 0.0003503, stamp: 0.00003, fno: true },
  { k: "futures", label: "Futures", stt: 0.0002, side: "sell", txn: 0.0000173, stamp: 0.00002, fno: true },
  { k: "intraday", label: "Intraday", stt: 0.00025, side: "sell", txn: 0.0000297, stamp: 0.00003, fno: false },
  { k: "delivery", label: "Delivery", stt: 0.001, side: "both", txn: 0.0000297, stamp: 0.00015, fno: false },
] as const;
const SEBI_RATE = 0.000001; // ₹10 per crore
const GST_RATE = 0.18;

/* ---------- formatting helpers ---------- */
const inr = (n: number) =>
  "₹" +
  (isFinite(n) ? Math.round(n) : 0).toLocaleString("en-IN");
const inr2 = (n: number) =>
  "₹" +
  (isFinite(n) ? n : 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const num = (v: string) => {
  const n = parseFloat(v);
  return isFinite(n) ? n : 0;
};

export default function Page() {
  const [tab, setTab] = useState<TabId>("risk");

  return (
    <div className={shell.page}>
      <PageHeader icon={<CalculatorIcon size={22} />} title="Calculator" howto />

      <div className={css.card}>
        <h2 className={css.cardTitle}>
          {tab === "risk" && "Risk / Position Size Calculator"}
          {tab === "cagr" && "CAGR Calculator"}
          {tab === "sip" && "SIP Calculator"}
          {tab === "emi" && "EMI Calculator"}
          {tab === "charges" && "Brokerage & P&L Calculator"}
          <span>💡</span>
        </h2>

        {/* Tab row */}
        <div className={css.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${css.tab} ${tab === t.id ? css.tabActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className={css.ico}>{t.ico}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Active pane */}
        {tab === "risk" && <RiskPane />}
        {tab === "cagr" && <CagrPane />}
        {tab === "sip" && <SipPane />}
        {tab === "emi" && <EmiPane />}
        {tab === "charges" && <ChargesPane />}
      </div>
    </div>
  );
}

/* ---------------- Risk / Position Size ---------------- */
function RiskPane() {
  const [seg, setSeg] = useState<"equity" | "fno">("equity");
  const [capital, setCapital] = useState("");
  const [risk, setRisk] = useState("");
  const [sl, setSl] = useState("");
  const [lot, setLot] = useState("");
  const [out, setOut] = useState<{ atRisk: number; qty: number; lots: number } | null>(
    null
  );

  const clear = () => {
    setCapital("");
    setRisk("");
    setSl("");
    setLot("");
    setOut(null);
  };
  const calc = () => {
    const atRisk = (num(capital) * num(risk)) / 100;
    const slv = num(sl);
    const qty = slv > 0 ? atRisk / slv : 0;
    const lotSize = num(lot) || 1;
    const lots = seg === "fno" && lotSize > 0 ? Math.floor(qty / lotSize) : 0;
    setOut({ atRisk, qty, lots });
  };

  return (
    <div className={css.pane}>
      <div className={css.segRow}>
        <div className={css.seg}>
          <button
            className={`${css.segBtn} ${seg === "equity" ? css.segActive : ""}`}
            onClick={() => setSeg("equity")}
          >
            Equity
          </button>
          <button
            className={`${css.segBtn} ${seg === "fno" ? css.segActive : ""}`}
            onClick={() => setSeg("fno")}
          >
            F&O
          </button>
        </div>
      </div>

      <Field label="Account Capital" req>
        <input
          className={css.input}
          type="number"
          inputMode="decimal"
          placeholder="Enter capital amount"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
        />
      </Field>
      <Field label="Risk per trade (%)" req>
        <input
          className={css.input}
          type="number"
          inputMode="decimal"
          placeholder="Enter risk per trade"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        />
      </Field>
      <Field label="Stoploss (in ₹ per share)" req>
        <input
          className={css.input}
          type="number"
          inputMode="decimal"
          placeholder="Enter stoploss amount"
          value={sl}
          onChange={(e) => setSl(e.target.value)}
        />
      </Field>
      {seg === "fno" && (
        <Field label="Lot size">
          <input
            className={css.input}
            type="number"
            inputMode="numeric"
            placeholder="Enter lot size"
            value={lot}
            onChange={(e) => setLot(e.target.value)}
          />
        </Field>
      )}

      <Actions onClear={clear} onCalc={calc} />

      <Result title="Result">
        <Row k="Amount at Risk" v={inr(out?.atRisk ?? 0)} accent />
        <Row k="Total Quantity" v={String(Math.floor(out?.qty ?? 0))} />
        {seg === "fno" && <Row k="Total Lots" v={String(out?.lots ?? 0)} />}
      </Result>
    </div>
  );
}

/* ---------------- CAGR ---------------- */
function CagrPane() {
  const [init, setInit] = useState("");
  const [final, setFinal] = useState("");
  const [years, setYears] = useState("");
  const [out, setOut] = useState<{ cagr: number; abs: number; gain: number } | null>(
    null
  );

  const clear = () => {
    setInit("");
    setFinal("");
    setYears("");
    setOut(null);
  };
  const calc = () => {
    const p = num(init);
    const f = num(final);
    const y = num(years);
    const cagr = p > 0 && y > 0 ? (Math.pow(f / p, 1 / y) - 1) * 100 : 0;
    const abs = p > 0 ? ((f - p) / p) * 100 : 0;
    setOut({ cagr, abs, gain: f - p });
  };

  return (
    <div className={css.pane}>
      <Field label="Initial Investment" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter initial value"
          value={init}
          onChange={(e) => setInit(e.target.value)}
        />
      </Field>
      <Field label="Final Value" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter final value"
          value={final}
          onChange={(e) => setFinal(e.target.value)}
        />
      </Field>
      <Field label="Duration (years)" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter number of years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
      </Field>

      <Actions onClear={clear} onCalc={calc} />

      <Result title="Result">
        <Row
          k="CAGR"
          v={(out?.cagr ?? 0).toFixed(2) + "%"}
          tone={(out?.cagr ?? 0) >= 0 ? "up" : "down"}
        />
        <Row
          k="Absolute Return"
          v={(out?.abs ?? 0).toFixed(2) + "%"}
          tone={(out?.abs ?? 0) >= 0 ? "up" : "down"}
        />
        <Row k="Total Gain" v={inr(out?.gain ?? 0)} />
      </Result>
    </div>
  );
}

/* ---------------- SIP ---------------- */
function SipPane() {
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [out, setOut] = useState<
    { invested: number; returns: number; total: number } | null
  >(null);

  const clear = () => {
    setMonthly("");
    setRate("");
    setYears("");
    setOut(null);
  };
  const calc = () => {
    const p = num(monthly);
    const n = num(years) * 12;
    const i = num(rate) / 12 / 100;
    const total =
      i > 0 ? p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : p * n;
    const invested = p * n;
    setOut({ invested, returns: total - invested, total });
  };

  return (
    <div className={css.pane}>
      <Field label="Monthly Investment" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter monthly amount"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
        />
      </Field>
      <Field label="Expected Return (% p.a.)" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter expected annual return"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </Field>
      <Field label="Time Period (years)" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter number of years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
      </Field>

      <Actions onClear={clear} onCalc={calc} />

      <Result title="Result">
        <Row k="Invested Amount" v={inr(out?.invested ?? 0)} />
        <Row k="Est. Returns" v={inr(out?.returns ?? 0)} tone="up" />
        <Row k="Total Value" v={inr(out?.total ?? 0)} accent />
      </Result>
    </div>
  );
}

/* ---------------- EMI ---------------- */
function EmiPane() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");
  const [out, setOut] = useState<
    { emi: number; interest: number; total: number } | null
  >(null);

  const clear = () => {
    setAmount("");
    setRate("");
    setMonths("");
    setOut(null);
  };
  const calc = () => {
    const p = num(amount);
    const n = num(months);
    const r = num(rate) / 12 / 100;
    const emi =
      r > 0
        ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        : n > 0
        ? p / n
        : 0;
    const total = emi * n;
    setOut({ emi, interest: total - p, total });
  };

  return (
    <div className={css.pane}>
      <Field label="Loan Amount" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter loan amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Field>
      <Field label="Interest Rate (% p.a.)" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter annual interest rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </Field>
      <Field label="Tenure (months)" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter number of months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />
      </Field>

      <Actions onClear={clear} onCalc={calc} />

      <Result title="Result">
        <Row k="Monthly EMI" v={inr2(out?.emi ?? 0)} accent />
        <Row k="Total Interest" v={inr(out?.interest ?? 0)} tone="down" />
        <Row k="Total Payment" v={inr(out?.total ?? 0)} />
      </Result>
    </div>
  );
}

/* ---------------- Brokerage & P&L (Indian charges) ---------------- */
type ChargeOut = {
  gross: number;
  brokerage: number;
  stt: number;
  txn: number;
  sebi: number;
  stamp: number;
  gst: number;
  total: number;
  net: number;
};

function ChargesPane() {
  const [segIdx, setSegIdx] = useState(0);
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [lots, setLots] = useState("");
  const [qtyEq, setQtyEq] = useState("");
  const [brk, setBrk] = useState("20");
  const [out, setOut] = useState<ChargeOut | null>(null);

  const g = CSEG[segIdx];

  const clear = () => {
    setBuy("");
    setSell("");
    setLotSize("");
    setLots("");
    setQtyEq("");
    setBrk("20");
    setOut(null);
  };
  const calc = () => {
    const qty = g.fno ? num(lotSize) * num(lots) : num(qtyEq);
    const b = num(buy);
    const s = num(sell);
    const buyVal = b * qty;
    const sellVal = s * qty;
    const turn = buyVal + sellVal;
    const brokerage = num(brk) * 2;
    const stt = g.side === "both" ? g.stt * turn : g.stt * sellVal;
    const txn = g.txn * turn;
    const sebi = SEBI_RATE * turn;
    const stamp = g.stamp * buyVal;
    const gst = GST_RATE * (brokerage + txn + sebi);
    const total = brokerage + stt + txn + sebi + stamp + gst;
    const gross = (s - b) * qty;
    setOut({ gross, brokerage, stt, txn, sebi, stamp, gst, total, net: gross - total });
  };

  return (
    <div className={css.pane}>
      <div className={css.segRow}>
        <div className={css.seg}>
          {CSEG.map((seg, i) => (
            <button
              key={seg.k}
              className={`${css.segBtn} ${i === segIdx ? css.segActive : ""}`}
              onClick={() => setSegIdx(i)}
            >
              {seg.label}
            </button>
          ))}
        </div>
      </div>

      <Field label="Buy Price (₹)" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter buy price"
          value={buy}
          onChange={(e) => setBuy(e.target.value)}
        />
      </Field>
      <Field label="Sell Price (₹)" req>
        <input
          className={css.input}
          type="number"
          placeholder="Enter sell price"
          value={sell}
          onChange={(e) => setSell(e.target.value)}
        />
      </Field>
      {g.fno ? (
        <>
          <Field label="Lot Size" req>
            <input
              className={css.input}
              type="number"
              placeholder="e.g. 75 for NIFTY"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
            />
          </Field>
          <Field label="No. of Lots" req>
            <input
              className={css.input}
              type="number"
              placeholder="Enter number of lots"
              value={lots}
              onChange={(e) => setLots(e.target.value)}
            />
          </Field>
        </>
      ) : (
        <Field label="Quantity (shares)" req>
          <input
            className={css.input}
            type="number"
            placeholder="Enter quantity"
            value={qtyEq}
            onChange={(e) => setQtyEq(e.target.value)}
          />
        </Field>
      )}
      <Field label="Brokerage per order (₹)">
        <input
          className={css.input}
          type="number"
          placeholder="e.g. 20 (0 for delivery)"
          value={brk}
          onChange={(e) => setBrk(e.target.value)}
        />
      </Field>

      <Actions onClear={clear} onCalc={calc} />

      <Result title="Result">
        <Row
          k="Gross P&L"
          v={inr(out?.gross ?? 0)}
          tone={(out?.gross ?? 0) >= 0 ? "up" : "down"}
        />
        <Row k="Brokerage" v={inr2(out?.brokerage ?? 0)} />
        <Row k="STT" v={inr2(out?.stt ?? 0)} />
        <Row k="Exchange Txn" v={inr2(out?.txn ?? 0)} />
        <Row k="SEBI Charges" v={inr2(out?.sebi ?? 0)} />
        <Row k="Stamp Duty" v={inr2(out?.stamp ?? 0)} />
        <Row k="GST (18%)" v={inr2(out?.gst ?? 0)} />
        <Row k="Total Charges" v={inr2(out?.total ?? 0)} tone="down" />
        <Row
          k="Net P&L"
          v={inr(out?.net ?? 0)}
          tone={(out?.net ?? 0) >= 0 ? "up" : "down"}
        />
      </Result>
      <p className={css.hint}>
        Indicative — NSE charges + current statutory rates (STT, exchange txn, SEBI
        ₹10/cr, stamp duty, 18% GST). Brokerage is editable (₹20/order default;
        delivery often ₹0). Equity delivery may also attract DP charges on sell.
      </p>
    </div>
  );
}

/* ---------------- shared bits ---------------- */
function Field({
  label,
  req,
  children,
}: {
  label: string;
  req?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={css.field}>
      <label className={css.label}>
        {label} {req && <span className={css.req}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Actions({ onClear, onCalc }: { onClear: () => void; onCalc: () => void }) {
  return (
    <div className={css.actions}>
      <button className={`${css.btn} ${css.btnGhost}`} onClick={onClear}>
        Clear
      </button>
      <button className={`${css.btn} ${css.btnPrimary}`} onClick={onCalc}>
        Calculate
      </button>
    </div>
  );
}

function Result({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={css.result}>
      <div className={css.resultTitle}>{title}</div>
      {children}
    </div>
  );
}

function Row({
  k,
  v,
  accent,
  tone,
}: {
  k: string;
  v: string;
  accent?: boolean;
  tone?: "up" | "down";
}) {
  const cls = tone === "up" ? css.vUp : tone === "down" ? css.vDown : accent ? css.vAccent : "";
  return (
    <div className={css.resultRow}>
      <span className={css.k}>{k}</span>
      <span className={`${css.v} ${cls}`}>{v}</span>
    </div>
  );
}
