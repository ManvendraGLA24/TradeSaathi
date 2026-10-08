"use client";

/**
 * PageHeader — the title row shared by every feature page
 * (icon + title, optional "How to use" and "LIVE" badge), matching the
 * TradeFinder reference headers.
 */

import type { ReactNode } from "react";
import shell from "./shell.module.css";

export function PageHeader({
  icon,
  title,
  live = false,
  howto = false,
  right,
}: {
  icon?: ReactNode;
  title: string;
  live?: boolean;
  howto?: boolean;
  right?: ReactNode;
}) {
  return (
    <div className={shell.head}>
      <div className={shell.headTitle}>
        {icon && <span className={shell.headIcon}>{icon}</span>}
        <h1>{title}</h1>
      </div>
      {howto && (
        <button className={shell.howto}>
          How to use <span className={shell.play}>▶</span>
        </button>
      )}
      {live && <span className={shell.live}>LIVE</span>}
      <span className={shell.spacer} />
      {right}
    </div>
  );
}
