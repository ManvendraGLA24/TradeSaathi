"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { FiiDiiIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="FII DII"
      icon={<FiiDiiIcon size={22} />}
      blurb="Daily FII/DII cash and F&O activity. Build as a table + bar chart of net buy/sell by day."
      reference="FIIDII01–03.png"
    />
  );
}
