import { TitansIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Trade Titans"
      icon={<TitansIcon size={22} />}
      description="A paper-trading challenge dashboard with a sample leaderboard and session stats."
      metrics={[
        { label: "YOUR RANK", value: "#12", change: "Practice board", tone: "accent" },
        { label: "PAPER P&L", value: "+₹12,480", change: "Sample score", tone: "up" },
        { label: "ACCURACY", value: "68%", change: "Practice trades", tone: "up" },
        { label: "TIME LEFT", value: "02:14:36", change: "Challenge preview", tone: "accent" },
      ]}
      cards={[
        { title: "Today's paper session", description: "Five-minute chart · NIFTY 50", value: "Open practice board", tag: "PAPER MODE", tone: "accent" },
        { title: "Challenge rules", description: "Use virtual funds, manage risk and compare your process with the leaderboard.", value: "No real orders", tag: "PRACTICE", tone: "up" },
      ]}
      table={{
        columns: ["RANK", "TRADER", "PAPER P&L", "WIN RATE", "TRADES"],
        rows: [
          ["01", "MarketMaven", "+₹28,640", "76%", "18"],
          ["02", "ChartPilot", "+₹24,120", "72%", "21"],
          ["03", "DeltaWave", "+₹19,880", "70%", "16"],
          ["12", "You", "+₹12,480", "68%", "14"],
        ],
      }}
    />
  );
}
