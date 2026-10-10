import { SwingIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

const sampleBreakouts = {
  columns: ["SYMBOL", "COMPANY", "SETUP DATE", "LAST PRICE", "MOVE"],
  rows: [
    ["TATACHEM", "Tata Chemicals", "10 Oct", "₹1,084.20", "+2.10%"],
    ["BAJFINANCE", "Bajaj Finance", "10 Oct", "₹8,742.00", "+1.84%"],
    ["IDEA", "Vodafone Idea", "09 Oct", "₹14.72", "+1.22%"],
    ["PVRINOX", "PVR Inox", "09 Oct", "₹1,386.50", "+0.96%"],
    ["PEL", "Piramal Enterprises", "08 Oct", "₹1,142.80", "+0.73%"],
  ],
};

export default function Page() {
  return (
    <StaticModulePage
      title="Swing Spectrum"
      icon={<SwingIcon size={22} />}
      description="A multi-day setup board for breakouts, reversals, channels and narrow-range stocks."
      metrics={[
        { label: "10 DAY BREAKOUT", value: "14", change: "Sample setups", tone: "up" },
        { label: "50 DAY BREAKOUT", value: "09", change: "Sample setups", tone: "up" },
        { label: "REVERSAL RADAR", value: "07", change: "Watchlist", tone: "accent" },
        { label: "NR7", value: "11", change: "Narrow range", tone: "accent" },
      ]}
      filters={["Setup", "Direction", "Timeframe"]}
      blocks={[
        { title: "10 Day Breakout", description: "Stocks crossing a recent 10-session range.", table: sampleBreakouts },
        { title: "50 Day Breakout", description: "Longer-term range breaks for a wider swing horizon.", table: sampleBreakouts },
        {
          title: "Reversal Radar",
          description: "Illustrative reversal candidates and current pattern labels.",
          cards: [
            { title: "HINDALCO", description: "Pullback into a prior support zone.", value: "Support retest", tag: "REVERSAL", tone: "up" },
            { title: "TATAMOTORS", description: "Range compression near a trend level.", value: "Watch breakout", tag: "CHANNEL", tone: "accent" },
            { title: "INFY", description: "Narrow weekly range with a defined pivot.", value: "NR7 pattern", tag: "NR7", tone: "accent" },
          ],
        },
      ]}
    />
  );
}
