"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { ApexIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Option Apex"
      icon={<ApexIcon size={22} />}
      live
      blurb="Candle-by-candle option flow with sentiment context for timing entries and exits."
      reference="OptionApex01–02.png"
    />
  );
}
