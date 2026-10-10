import { MoverIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Index Mover"
      icon={<MoverIcon size={22} />}
      description="Sample index contribution board ranking the stocks pushing or weighing on the session."
      metrics={[
        { label: "INDEX", value: "NIFTY 50", change: "Selected benchmark", tone: "accent" },
        { label: "NET CONTRIBUTION", value: "+42.6 pts", change: "Illustrative session", tone: "up" },
        { label: "TOP SUPPORT", value: "RELIANCE", change: "+8.4 pts", tone: "up" },
        { label: "TOP DRAG", value: "HDFCBANK", change: "−5.2 pts", tone: "down" },
      ]}
      filters={["Index", "Direction"]}
      blocks={[
        {
          title: "Point contribution",
          description: "Positive contributors add points; negative contributors subtract from the index.",
          bars: [
            { label: "RELIANCE", value: "+8.4", height: 85, tone: "up" },
            { label: "INFY", value: "+6.1", height: 66, tone: "up" },
            { label: "ICICIBANK", value: "+4.8", height: 54, tone: "up" },
            { label: "TCS", value: "+3.2", height: 42, tone: "up" },
            { label: "HDFCBANK", value: "−5.2", height: 70, tone: "down" },
            { label: "ITC", value: "−2.7", height: 44, tone: "down" },
          ],
        },
        {
          title: "Constituent ranking",
          table: {
            columns: ["RANK", "SYMBOL", "WEIGHT", "CHANGE", "CONTRIBUTION"],
            rows: [
              ["01", "RELIANCE", "9.8%", "+1.24%", "+8.4 pts"],
              ["02", "INFY", "6.1%", "+1.08%", "+6.1 pts"],
              ["03", "ICICIBANK", "7.9%", "+0.62%", "+4.8 pts"],
              ["04", "TCS", "4.2%", "+0.83%", "+3.2 pts"],
              ["05", "HDFCBANK", "11.4%", "−0.41%", "−5.2 pts"],
              ["06", "ITC", "4.1%", "−0.66%", "−2.7 pts"],
            ],
          },
        },
      ]}
    />
  );
}
