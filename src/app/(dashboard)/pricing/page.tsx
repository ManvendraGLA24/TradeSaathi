"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";

export default function Page() {
  return (
    <FeatureScaffold
      title="Unlock Premium"
      blurb="Where locked features send non-subscribers. Build your plan cards + checkout here. Query param ?feature=<id> tells you which feature the user tried to open."
    />
  );
}
