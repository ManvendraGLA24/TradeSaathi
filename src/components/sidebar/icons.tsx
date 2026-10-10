/**
 * icons.tsx
 * -------------------------------------------------------------------------
 * Lightweight, dependency-free SVG icons used by the sidebar.
 *
 * Why inline SVGs instead of an icon library?
 *  - Zero extra dependencies — the component drops into any React/Next.js app.
 *  - Each icon inherits `currentColor`, so we can tint them per-group with CSS.
 *
 * If you'd rather use an icon library, you can swap these one-for-one with
 * `lucide-react` (same names exist there) and delete this file. See README.
 * -------------------------------------------------------------------------
 */

import type { IconType } from "./types";

type P = { size?: number; className?: string };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const HomeIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export const StocksIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 17l5-5 4 4 8-8" />
    <path d="M14 8h6v6" />
  </svg>
);

export const IndexIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 14l3-3 2 2 5-5" />
  </svg>
);

export const ToolsIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <rect x="14" y="14" width="6" height="6" rx="1.5" />
  </svg>
);

export const MoreIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
  </svg>
);

export const PulseIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 12h4l2-6 4 12 2-6h6" />
  </svg>
);

export const StrategyIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
);

export const SectorIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9l6 4" />
  </svg>
);

export const SwingIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 18c4 0 4-12 8-12s4 12 8 12" />
  </svg>
);

export const ClockIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ApexIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

export const MoverIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20h-20" />
  </svg>
);

export const FiiDiiIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h10" />
    <circle cx="19" cy="17" r="2" />
  </svg>
);

export const CommunityIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
    <path d="M16 6a3 3 0 0 1 0 6M18 20c0-2-1-3.5-2.5-4.3" />
  </svg>
);

export const JournalIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M5 4h12a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 1-2Z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
);

export const WatchlistIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z" />
  </svg>
);

export const CalculatorIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8M8 11h0M12 11h0M16 11h0M8 15h0M12 15h0M16 15h0" />
  </svg>
);

export const GamesIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="2" y="7" width="20" height="10" rx="5" />
    <path d="M7 11v2M6 12h2M15 12h0M18 12h0" />
  </svg>
);

export const FlipIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 8a9 3 0 0 0 18 0M3 8a9 3 0 0 1 18 0v8a9 3 0 0 1-18 0Z" />
  </svg>
);

export const TitansIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" />
    <path d="M12 12v4M8 20h8M10 16h4" />
  </svg>
);

export const VideosIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M10 9l5 3-5 3V9Z" />
  </svg>
);

export const FeedbackIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4 5h16v11H9l-5 4V5Z" />
    <path d="M8 10h8M8 13h5" />
  </svg>
);

export const SettingsIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </svg>
);

/** UI chrome icons (chevron, lock, bell) used by the shell, not the config. */
export const ChevronIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const BellIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const CloseIcon: IconType = ({ size, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
