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
 * Navigation items link directly to their UI preview routes.
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
      { kind: "leaf", id: "market-pulse",     label: "Market Pulse",     href: "/market-pulse",     icon: PulseIcon },
      { kind: "leaf", id: "insider-strategy",  label: "Insider Strategy",  href: "/insider-strategy", icon: StrategyIcon },
      { kind: "leaf", id: "sector-scope",      label: "Sector Scope",     href: "/sector-scope",     icon: SectorIcon },
      { kind: "leaf", id: "swing-spectrum",    label: "Swing Spectrum",   href: "/swing-spectrum",   icon: SwingIcon },
    ],
  },

  {
    kind: "group",
    id: "index",
    label: "Index",
    icon: IndexIcon,
    defaultOpen: true,
    children: [
      { kind: "leaf", id: "option-clock", label: "Option Clock", href: "/option-clock", icon: ClockIcon },
      { kind: "leaf", id: "option-apex",  label: "Option Apex",  href: "/option-apex",  icon: ApexIcon },
      { kind: "leaf", id: "index-mover",  label: "Index Mover",  href: "/index-mover", icon: MoverIcon },
    ],
  },

  { kind: "leaf", id: "fii-dii",         label: "FII DII",         href: "/fii-dii",         icon: FiiDiiIcon },
  { kind: "leaf", id: "community",       label: "Community",       href: "/community",       icon: CommunityIcon },
  { kind: "leaf", id: "trading-journal", label: "Trading Journal", href: "/trading-journal", icon: JournalIcon },
  { kind: "leaf", id: "watchlist",       label: "Watchlist",       href: "/watchlist",       icon: WatchlistIcon },
  { kind: "leaf", id: "calculator",      label: "Calculator",      href: "/calculator",      icon: CalculatorIcon },

  {
    kind: "group",
    id: "games",
    label: "Games",
    icon: GamesIcon,
    defaultOpen: true,
    children: [
      { kind: "leaf", id: "flip-it",      label: "Flip It",      href: "/games/flip-it",      icon: FlipIcon },
      { kind: "leaf", id: "trade-titans", label: "Trade Titans", href: "/games/trade-titans", icon: TitansIcon },
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
