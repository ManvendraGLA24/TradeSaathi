import { CommunityIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Community"
      icon={<CommunityIcon size={22} />}
      description="A discussion feed layout for chart ideas, market notes and peer conversations."
      metrics={[
        { label: "DISCUSSIONS", value: "128", change: "This week", tone: "accent" },
        { label: "ACTIVE TRADERS", value: "42", change: "Community preview", tone: "up" },
      ]}
      filters={["Topic", "Sort by"]}
      cards={[
        { title: "Aarav · NIFTY view", description: "Watching the opening range. A clean move above resistance could bring momentum; keeping risk defined below the morning low.", value: "NIFTY 50 · 5 min", change: "24 replies · 86 likes", tag: "MARKET VIEW", tone: "accent" },
        { title: "Meera · Trade review", description: "Waited for the retest instead of chasing the first candle. Sharing the level and notes from today's setup.", value: "RELIANCE · Daily", change: "12 replies · 54 likes", tag: "TRADE REVIEW", tone: "up" },
        { title: "Kabir · Learning corner", description: "How do you use volume expansion to confirm a breakout without entering too late?", value: "Strategy discussion", change: "18 replies · 31 likes", tag: "QUESTION", tone: "accent" },
      ]}
      fields={[
        { label: "Start a discussion", placeholder: "Share a market observation or question…" },
      ]}
      actionLabel="Create post"
    />
  );
}
