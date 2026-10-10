import { ApexIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Option Apex"
      icon={<ApexIcon size={22} />}
      description="An options-flow overview with sample money-flux bars and call/put activity."
      metrics={[
        { label: "INDEX", value: "NIFTY 50", change: "Sample contract", tone: "accent" },
        { label: "SESSION BIAS", value: "Bullish", change: "Illustrative reading", tone: "up" },
        { label: "CALL FLOW", value: "₹148.6 Cr", change: "+12.4% sample flow", tone: "up" },
        { label: "PUT FLOW", value: "₹126.2 Cr", change: "−4.8% sample flow", tone: "down" },
      ]}
      filters={["Index", "Expiry", "Strike range"]}
      blocks={[
        {
          title: "Money Flux",
          description: "Example option premium flow by time. Bars are decorative sample values.",
          bars: [
            { label: "09:30", value: "₹18Cr", height: 48, tone: "up" },
            { label: "10:00", value: "₹24Cr", height: 65, tone: "up" },
            { label: "10:30", value: "₹15Cr", height: 38, tone: "down" },
            { label: "11:00", value: "₹31Cr", height: 84, tone: "up" },
            { label: "11:30", value: "₹21Cr", height: 56, tone: "down" },
            { label: "12:00", value: "₹36Cr", height: 96, tone: "up" },
            { label: "12:30", value: "₹28Cr", height: 74, tone: "up" },
          ],
        },
        {
          title: "Option activity",
          description: "Representative strikes with an at-a-glance sentiment label.",
          table: {
            columns: ["STRIKE", "CALL PREMIUM", "CALL Δ OI", "PUT Δ OI", "PUT PREMIUM", "BIAS"],
            rows: [
              ["24,950", "₹142.6", "+18.2K", "−4.8K", "₹91.4", "CALL BUILD"],
              ["25,000", "₹108.2", "+26.4K", "+3.1K", "₹118.7", "MIXED"],
              ["25,050", "₹78.5", "+9.6K", "+14.3K", "₹151.2", "PUT BUILD"],
              ["25,100", "₹54.1", "+7.2K", "+11.8K", "₹187.9", "PUT BUILD"],
            ],
          },
        },
      ]}
    />
  );
}
