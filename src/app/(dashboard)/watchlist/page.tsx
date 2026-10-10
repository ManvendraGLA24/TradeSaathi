import { WatchlistIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Watchlist"
      icon={<WatchlistIcon size={22} />}
      description="A sample stock list with price movement and range context."
      metrics={[
        { label: "SAVED SYMBOLS", value: "08", change: "Example list", tone: "accent" },
        { label: "ADVANCING", value: "05", change: "Sample session", tone: "up" },
        { label: "DECLINING", value: "03", change: "Sample session", tone: "down" },
        { label: "DAY CHANGE", value: "+0.84%", change: "Illustrative average", tone: "up" },
      ]}
      filters={["Watchlist", "Sort by"]}
      table={{
        columns: ["SYMBOL", "LAST PRICE", "CHANGE", "DAY RANGE", "VOLUME"],
        rows: [
          ["RELIANCE", "₹1,428.60", "+1.24%", "₹1,402–1,436", "4.82M"],
          ["HDFCBANK", "₹1,684.30", "−0.41%", "₹1,672–1,699", "3.16M"],
          ["INFY", "₹1,542.75", "+1.08%", "₹1,518–1,551", "2.74M"],
          ["TATAMOTORS", "₹684.20", "+0.76%", "₹675–691", "6.21M"],
          ["ICICIBANK", "₹1,192.40", "+0.62%", "₹1,180–1,201", "2.98M"],
          ["ITC", "₹448.65", "−0.66%", "₹445–454", "1.85M"],
          ["SBIN", "₹792.10", "+0.54%", "₹784–798", "3.44M"],
          ["TCS", "₹3,874.20", "−0.18%", "₹3,852–3,906", "0.62M"],
        ],
      }}
    />
  );
}
