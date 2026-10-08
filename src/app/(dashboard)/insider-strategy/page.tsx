"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { StrategyIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Insider Strategy"
      icon={<StrategyIcon size={22} />}
      live
      blurb="Heatmap of insider-style setups to spot concentrated buying and selling. Pattern is a heatmap/table hybrid — reuse the Sector Scope heat logic."
      reference="InsiderStrategy01–09.png"
    />
  );
}
