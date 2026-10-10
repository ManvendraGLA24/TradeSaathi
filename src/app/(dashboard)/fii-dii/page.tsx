import { FiiDiiIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="FII · DII"
      icon={<FiiDiiIcon size={22} />}
      description="A compact overview of sample institutional cash-market activity."
      metrics={[
        { label: "FII NET", value: "−₹1,248 Cr", change: "Illustrative daily flow", tone: "down" },
        { label: "DII NET", value: "+₹2,036 Cr", change: "Illustrative daily flow", tone: "up" },
        { label: "FII GROSS BUY", value: "₹12,408 Cr", tone: "accent" },
        { label: "DII GROSS BUY", value: "₹10,932 Cr", tone: "accent" },
      ]}
      filters={["Market segment", "Date range"]}
      blocks={[
        {
          title: "Recent net activity",
          description: "Sample net buy/sell values in ₹ crore.",
          bars: [
            { label: "06 Oct", value: "−812", height: 36, tone: "down" },
            { label: "07 Oct", value: "+1,120", height: 54, tone: "up" },
            { label: "08 Oct", value: "−460", height: 25, tone: "down" },
            { label: "09 Oct", value: "+1,780", height: 82, tone: "up" },
            { label: "10 Oct", value: "+788", height: 60, tone: "up" },
          ],
        },
        {
          title: "Cash market flow",
          table: {
            columns: ["DATE", "FII BUY", "FII SELL", "FII NET", "DII BUY", "DII SELL", "DII NET"],
            rows: [
              ["10 Oct", "12,408", "13,656", "−1,248", "10,932", "8,896", "+2,036"],
              ["09 Oct", "14,210", "13,782", "+428", "9,740", "8,388", "+1,352"],
              ["08 Oct", "11,640", "12,100", "−460", "8,925", "9,102", "−177"],
              ["07 Oct", "13,260", "12,140", "+1,120", "10,486", "9,211", "+1,275"],
            ],
          },
        },
      ]}
    />
  );
}
