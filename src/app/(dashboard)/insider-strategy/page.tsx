import { StrategyIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

const movers = [
  ["ADANIPORTS", "Adani Ports & SEZ", "14:28", "−3.42%", "SELL"],
  ["GODREJCP", "Godrej Consumer", "14:56", "−1.36%", "SELL"],
  ["IOC", "Indian Oil Corp.", "14:56", "−1.76%", "SELL"],
  ["PIIND", "PI Industries", "09:16", "+0.07%", "BUY"],
  ["DABUR", "Dabur India", "09:16", "−0.46%", "SELL"],
];

export default function Page() {
  return (
    <StaticModulePage
      title="Insider Strategy"
      icon={<StrategyIcon size={22} />}
      description="Momentum spikes and loss-of-momentum setups, arranged as quick scanner previews."
      metrics={[
        { label: "5 MIN MOMENTUM SPIKE", value: "12 symbols", change: "Intraday scan", tone: "accent" },
        { label: "10 MIN MOMENTUM SPIKE", value: "08 symbols", change: "Intraday scan", tone: "accent" },
        { label: "LONG MOMENTUM", value: "18 symbols", change: "Trend watch", tone: "up" },
        { label: "CONTRACTION BO", value: "06 symbols", change: "Setup watch", tone: "accent" },
      ]}
      filters={["Scanner", "Signal"]}
      blocks={[
        {
          title: "Momentum spike",
          description: "Example stocks showing a sudden move in price and activity.",
          cards: [
            { title: "5 min momentum", description: "Short-window move with rising participation.", value: "12 setups", tag: "INTRADAY", tone: "up" },
            { title: "10 min momentum", description: "Momentum continuing across the last few candles.", value: "08 setups", tag: "INTRADAY", tone: "accent" },
          ],
        },
        {
          title: "Loss of momentum · Short term",
          description: "Illustrative watchlist for reversals after a sustained move.",
          table: {
            columns: ["SYMBOL", "COMPANY", "TIME", "CHANGE", "BIAS"],
            rows: movers,
          },
        },
        {
          title: "Loss of momentum · Long term",
          description: "Longer-window examples with the same scanner layout.",
          table: {
            columns: ["SYMBOL", "COMPANY", "TIME", "CHANGE", "BIAS"],
            rows: [
              ["TATAMOTORS", "Tata Motors", "13:42", "+1.24%", "BUY"],
              ["HINDALCO", "Hindalco Industries", "12:18", "−0.82%", "SELL"],
              ["SBIN", "State Bank of India", "11:34", "+0.63%", "BUY"],
            ],
          },
        },
      ]}
    />
  );
}
