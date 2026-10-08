"use client";

/**
 * FeatureScaffold — consistent placeholder for feature pages not yet built out.
 *
 * Every remaining route (Swing Spectrum, Insider Strategy, Option Clock, etc.)
 * uses this so the whole app is navigable with matching chrome. Replace a
 * route's scaffold with a real page (see market-pulse / sector-scope as the
 * two reference patterns) when you build it.
 */

import type { ReactNode } from "react";
import shell from "./shell.module.css";
import { PageHeader } from "./PageHeader";

export function FeatureScaffold({
  title,
  icon,
  blurb,
  live = false,
  reference,
}: {
  title: string;
  icon?: ReactNode;
  blurb: string;
  live?: boolean;
  reference?: string; // which screenshot(s) this page should match
}) {
  return (
    <div className={shell.page}>
      <PageHeader icon={icon} title={title} howto live={live} />
      <div
        className={shell.panel}
        style={{ padding: "48px 28px", textAlign: "center" }}
      >
        <div style={{ fontSize: 15, color: "#fff", fontWeight: 800, marginBottom: 8 }}>
          {title} — ready to build out
        </div>
        <p style={{ color: "var(--muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6, fontSize: 14 }}>
          {blurb}
        </p>
        {reference && (
          <p style={{ color: "var(--accent)", marginTop: 14, fontSize: 12.5, fontWeight: 600 }}>
            Design reference: {reference}
          </p>
        )}
      </div>
    </div>
  );
}
