/**
 * Logo.tsx
 * -------------------------------------------------------------------------
 * TradeSaathi wordmark + emblem.
 *   "Trade" renders in the brand accent (cyan), "Saathi" in white — mirroring
 *   the two-tone treatment in the reference design.
 *
 * The emblem is a simple generic chart glyph (no third-party brand marks).
 * Replace <EmblemSvg/> with your own logo file whenever it's ready.
 * -------------------------------------------------------------------------
 */

import styles from "./Sidebar.module.css";

function EmblemSvg() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M11 25l5-6 4 3 9-10"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="29" cy="12" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className={styles.logo}>
      <span className={styles.logoEmblem}>
        <EmblemSvg />
      </span>
      <span className={styles.logoWord}>
        <span className={styles.logoAccent}>Trade</span>
        <span className={styles.logoWhite}>Saathi</span>
      </span>
    </div>
  );
}
