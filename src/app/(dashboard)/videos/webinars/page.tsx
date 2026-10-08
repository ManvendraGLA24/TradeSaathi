"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { VideosIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold title="Webinars" icon={<VideosIcon size={22} />} blurb="Live / recorded webinar sessions. Build as a schedule + recordings list." />
  );
}
