"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { FeedbackIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Feedback"
      icon={<FeedbackIcon size={22} />}
      blurb="Share feedback or report an issue. Build as a simple form posting to your backend."
    />
  );
}
