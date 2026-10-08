"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { SwingIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Swing Spectrum"
      icon={<SwingIcon size={22} />}
      live
      blurb="Swing ideas from breakouts, NR7 and weekly structures for multi-day holds. Build as a filterable cards/table view."
      reference="SwingSpectrum01–07.png"
    />
  );
}
