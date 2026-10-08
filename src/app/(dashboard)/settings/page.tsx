"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { SettingsIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Settings"
      icon={<SettingsIcon size={22} />}
      blurb="Profile, subscription, Angel One connection and preferences. Build as tabbed settings sections."
    />
  );
}
