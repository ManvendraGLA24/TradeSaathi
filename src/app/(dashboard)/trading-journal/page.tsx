"use client";
import { FeatureScaffold } from "@/components/ui/FeatureScaffold";
import { JournalIcon } from "@/components/sidebar/icons";

export default function Page() {
  return (
    <FeatureScaffold
      title="Trading Journal"
      icon={<JournalIcon size={22} />}
      blurb="Log trades with entry/exit, P&L and notes. Build as a table + add-trade form + simple equity curve."
      reference="TradingJournal.png"
    />
  );
}
