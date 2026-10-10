import { ClockIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Option Clock"
      icon={<ClockIcon size={22} />}
      description="A time-window view of sample index option positioning and open-interest distribution."
      metrics={[
        { label: "INDEX", value: "NIFTY 50", change: "Weekly expiry", tone: "accent" },
        { label: "BULLISH OI", value: "12.33L", change: "51% of sample OI", tone: "up" },
        { label: "BEARISH OI", value: "11.74L", change: "49% of sample OI", tone: "down" },
        { label: "NET POSITION", value: "+59.2K", change: "Illustrative Δ OI", tone: "up" },
      ]}
      filters={["Index", "Expiry", "From time", "To time"]}
      blocks={[
        {
          title: "OI Clock",
          description: "Sample net positioning across the selected intraday window.",
          bars: [
            { label: "09:30", value: "+8k", height: 36, tone: "up" },
            { label: "10:30", value: "+14k", height: 59, tone: "up" },
            { label: "11:30", value: "−4k", height: 28, tone: "down" },
            { label: "12:30", value: "+19k", height: 76, tone: "up" },
            { label: "13:30", value: "+12k", height: 52, tone: "up" },
            { label: "14:30", value: "+21k", height: 90, tone: "up" },
            { label: "15:15", value: "+16k", height: 68, tone: "up" },
          ],
        },
        {
          title: "Strike distribution",
          description: "Illustrative call/put open interest by strike.",
          table: {
            columns: ["STRIKE", "CALL OI", "CALL CHANGE", "PUT CHANGE", "PUT OI"],
            rows: [
              ["24,900", "1,24,300", "+8,450", "+4,920", "1,08,600"],
              ["25,000", "1,86,700", "+12,240", "+9,120", "1,72,400"],
              ["25,100", "2,04,500", "+6,350", "+14,880", "2,11,200"],
              ["25,200", "1,52,900", "−2,400", "+7,640", "1,63,700"],
              ["25,300", "96,800", "−1,120", "+2,310", "1,04,500"],
            ],
          },
        },
      ]}
    />
  );
}
