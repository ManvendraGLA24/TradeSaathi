import { JournalIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Trading Journal"
      icon={<JournalIcon size={22} />}
      description="A sample trade log, performance summary and equity-curve preview."
      metrics={[
        { label: "TOTAL TRADES", value: "24", change: "This month", tone: "accent" },
        { label: "WIN RATE", value: "62.5%", change: "15 wins · 9 losses", tone: "up" },
        { label: "NET P&L", value: "+₹18,420", change: "Sample result", tone: "up" },
        { label: "AVG R:R", value: "1.8 : 1", change: "Closed positions", tone: "accent" },
      ]}
      filters={["Period", "Trade type"]}
      blocks={[
        {
          title: "Equity curve",
          description: "Illustrative daily cumulative P&L.",
          bars: [
            { label: "Mon", value: "+1.2k", height: 28, tone: "up" },
            { label: "Tue", value: "+2.4k", height: 42, tone: "up" },
            { label: "Wed", value: "−0.8k", height: 25, tone: "down" },
            { label: "Thu", value: "+3.1k", height: 67, tone: "up" },
            { label: "Fri", value: "+2.0k", height: 54, tone: "up" },
            { label: "Mon", value: "+4.8k", height: 90, tone: "up" },
          ],
        },
      ]}
      table={{
        columns: ["DATE", "SYMBOL", "SIDE", "ENTRY", "EXIT", "QTY", "P&L", "NOTES"],
        rows: [
          ["10 Oct", "RELIANCE", "BUY", "1,412.50", "1,428.60", "50", "+₹805", "Opening range"],
          ["09 Oct", "HDFCBANK", "SELL", "1,692.00", "1,698.40", "40", "−₹256", "Stopped out"],
          ["08 Oct", "INFY", "BUY", "1,516.20", "1,542.75", "30", "+₹796", "Breakout retest"],
          ["07 Oct", "SBIN", "BUY", "786.10", "792.10", "75", "+₹450", "Trend follow"],
        ],
      }}
    />
  );
}
