/**
 * navConfig.ts
 * -------------------------------------------------------------------------
 * THE SINGLE SOURCE OF TRUTH for the sidebar menu.
 *
 * Add / remove / reorder items here — the <Sidebar /> component renders
 * whatever this array contains. Each leaf's `id` intentionally matches the
 * saved screenshots in the design folder so you can line the UI up with the
 * reference (e.g. id "market-pulse" -> Marketpulse01.png, "sector-scope" ->
 * SectorScope01.png).
 *
 * `premium: true`  -> shows the lock icon and is gated for non-subscribers.
 * -------------------------------------------------------------------------
 */

import type { NavItem } from "./types";
import {
  HomeIcon, StocksIcon, IndexIcon, PulseIcon, StrategyIcon, SectorIcon,
  SwingIcon, ClockIcon, ApexIcon, MoverIcon, FiiDiiIcon, CommunityIcon,
  JournalIcon, WatchlistIcon, CalculatorIcon, GamesIcon, FlipIcon,
  TitansIcon, VideosIcon, FeedbackIcon, SettingsIcon,
} from "./icons";

export const NAV_CONFIG: NavItem[] = [
  { kind: "leaf", id: "home", label: "Home", href: "/", icon: HomeIcon },

  {
    kind: "group",
    id: "stocks",
    label: "Stocks",
    icon: StocksIcon,
    defaultOpen: true,
    children: [
      { kind: "leaf", id: "market-pulse",     label: "Market Pulse",     href: "/market-pulse",     icon: PulseIcon,    premium: true },
      { kind: "leaf", id: "insider-strategy",  label: "Insider Strategy",  href: "/insider-strategy", icon: StrategyIcon, premium: true },
      { kind: "leaf", id: "sector-scope",      label: "Sector Scope",      href: "/sector-scope",     icon: SectorIcon,   premium: true },
      { kind: "leaf", id: "swing-spectrum",    label: "Swing Spectrum",    href: "/swing-spectrum",   icon: SwingIcon,    premium: true },
    ],
  },

  {
    kind: "group",
    id: "index",
    label: "Index",
    icon: IndexIcon,
    defaultOpen: true,
    children: [
      { kind: "leaf", id: "option-clock", label: "Option Clock", href: "/option-clock", icon: ClockIcon, premium: true },
      { kind: "leaf", id: "option-apex",  label: "Option Apex",  href: "/option-apex",  icon: ApexIcon,  premium: true },
      { kind: "leaf", id: "index-mover",  label: "Index Mover",  href: "/index-mover",  icon: MoverIcon, premium: true },
    ],
  },

  { kind: "leaf", id: "fii-dii",         label: "FII DII",         href: "/fii-dii",         icon: FiiDiiIcon,    premium: true },
  { kind: "leaf", id: "community",       label: "Community",       href: "/community",       icon: CommunityIcon, premium: true },
  { kind: "leaf", id: "trading-journal", label: "Trading Journal", href: "/trading-journal", icon: JournalIcon,   premium: true },
  { kind: "leaf", id: "watchlist",       label: "Watchlist",       href: "/watchlist",       icon: WatchlistIcon, premium: true },
  { kind: "leaf", id: "calculator",      label: "Calculator",      href: "/calculator",      icon: CalculatorIcon, premium: true },

  {
    kind: "group",
    id: "games",
    label: "Games",
    icon: GamesIcon,
    defaultOpen: true,
    children: [
      { kind: "leaf", id: "flip-it",      label: "Flip It",      href: "/games/flip-it",      icon: FlipIcon,   premium: true },
      { kind: "leaf", id: "trade-titans", label: "Trade Titans", href: "/games/trade-titans", icon: TitansIcon, premium: true },
    ],
  },

  {
    kind: "group",
    id: "videos",
    label: "Videos",
    icon: VideosIcon,
    defaultOpen: false,
    children: [
      { kind: "leaf", id: "tutorials", label: "Tutorials", href: "/videos/tutorials", icon: VideosIcon },
      { kind: "leaf", id: "webinars",  label: "Webinars",  href: "/videos/webinars",  icon: VideosIcon },
    ],
  },

  { kind: "leaf", id: "feedback", label: "Feedback", href: "/feedback", icon: FeedbackIcon },
  { kind: "leaf", id: "settings", label: "Settings", href: "/settings", icon: SettingsIcon },
];
