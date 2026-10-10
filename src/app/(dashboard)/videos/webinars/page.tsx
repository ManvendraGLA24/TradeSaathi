import { VideosIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Webinars"
      icon={<VideosIcon size={22} />}
      description="An event schedule and replay library for market education sessions."
      filters={["Upcoming", "Topic"]}
      blocks={[
        {
          title: "Upcoming sessions",
          cards: [
            { title: "Building a consistent trading routine", description: "A practical walkthrough of preparation, risk planning and post-market review.", value: "18 Oct · 6:00 PM", tag: "UPCOMING", tone: "accent" },
            { title: "Options open interest explained", description: "Learn to interpret changes by strike and across the session.", value: "22 Oct · 5:30 PM", tag: "UPCOMING", tone: "accent" },
          ],
        },
        {
          title: "Recorded sessions",
          cards: [
            { title: "Reading sector rotation", description: "A guided tour of breadth and relative sector strength.", value: "42 min", tag: "REPLAY", tone: "up" },
            { title: "Breakout setups: plan and review", description: "Example entries, invalidation levels and trade journaling.", value: "36 min", tag: "REPLAY", tone: "up" },
          ],
        },
      ]}
    />
  );
}
