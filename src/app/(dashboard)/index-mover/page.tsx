"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { MoverIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Index Mover"
      icon={<MoverIcon size={22} />}
      live
      blurb="Stocks ranked by point contribution to the index for the session. Build as a ranked bar list (up/down contributors)."
      reference="IndexMover01–02.png"
    />
  );
}
