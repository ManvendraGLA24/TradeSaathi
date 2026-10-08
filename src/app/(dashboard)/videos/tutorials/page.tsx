"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { VideosIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold title="Tutorials" icon={<VideosIcon size={22} />} blurb="How-to video library. Build as a grid of video cards." />
  );
}
