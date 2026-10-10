import { VideosIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Tutorials"
      icon={<VideosIcon size={22} />}
      description="A learning-library layout with short guides for the platform's trading tools."
      filters={["Topic", "Level"]}
      cards={[
        { title: "Reading Market Pulse", description: "Understand scanner signals, breakout filters and the sample signal table.", value: "06:20", tag: "BEGINNER", tone: "accent" },
        { title: "Sector breadth basics", description: "Read the market heatmap and compare participation across sectors.", value: "08:45", tag: "BEGINNER", tone: "up" },
        { title: "Using Option Clock", description: "Explore time windows, strike distribution and open-interest changes.", value: "10:12", tag: "INTERMEDIATE", tone: "accent" },
        { title: "Build a trading journal", description: "Record a trade thesis and review outcomes in a consistent format.", value: "07:36", tag: "BEGINNER", tone: "accent" },
      ]}
    />
  );
}
