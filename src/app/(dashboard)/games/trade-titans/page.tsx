"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { TitansIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold title="Trade Titans" icon={<TitansIcon size={22} />} blurb="Leaderboard-style trading contest. Build as a leaderboard + contest detail view." />
  );
}
