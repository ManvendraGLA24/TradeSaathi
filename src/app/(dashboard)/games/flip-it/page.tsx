import { FlipIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Flip It"
      icon={<FlipIcon size={22} />}
      description="A practice-game screen concept for probability, timing and disciplined position sizing."
      metrics={[
        { label: "ROUND", value: "04", change: "Practice preview", tone: "accent" },
        { label: "PRACTICE BALANCE", value: "₹10,000", change: "Not real funds", tone: "accent" },
        { label: "CURRENT STREAK", value: "03", change: "Sample score", tone: "up" },
        { label: "ROUND TIMER", value: "00:24", change: "Static preview", tone: "down" },
      ]}
      cards={[
        { title: "Heads", description: "Practice a long-side prediction.", value: "UP", tag: "50% SAMPLE ODDS", tone: "up" },
        { title: "Tails", description: "Practice a short-side prediction.", value: "DOWN", tag: "50% SAMPLE ODDS", tone: "down" },
      ]}
      blocks={[
        {
          title: "Round history",
          table: {
            columns: ["ROUND", "PICK", "RESULT", "POINTS"],
            rows: [
              ["03", "Heads", "Correct", "+100"],
              ["02", "Tails", "Correct", "+100"],
              ["01", "Heads", "Miss", "−50"],
            ],
          },
        },
      ]}
    />
  );
}
