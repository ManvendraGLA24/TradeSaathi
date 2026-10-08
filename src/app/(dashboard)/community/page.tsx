"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { CommunityIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Community"
      icon={<CommunityIcon size={22} />}
      blurb="Traders' feed / discussion space. Build as a post feed with reactions."
    />
  );
}
