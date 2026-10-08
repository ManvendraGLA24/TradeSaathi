"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { ClockIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Option Clock"
      icon={<ClockIcon size={22} />}
      live
      blurb="Call/put OI change by strike and time window. Build as a time x strike grid/heatmap of OI build-up."
      reference="OptionClock.png, OptionClock01.png"
    />
  );
}
