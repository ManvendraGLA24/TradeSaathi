"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { WatchlistIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Watchlist"
      icon={<WatchlistIcon size={22} />}
      blurb="Personal symbol watchlist with live LTP and % change. Build as an editable table of symbols."
      reference="Watchlist.png"
    />
  );
}
