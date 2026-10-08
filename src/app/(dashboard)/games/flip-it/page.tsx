"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { FlipIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold title="Flip It" icon={<FlipIcon size={22} />} blurb="Gamified prediction game. Build as an interactive round-based UI." />
  );
}
