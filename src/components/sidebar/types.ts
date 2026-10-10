/**
 * types.ts
 * -------------------------------------------------------------------------
 * Shared types for the TradeSaathi sidebar navigation.
 *
 * The whole sidebar is "data-driven": the UI is rendered from the array in
 * `navConfig.ts`. To add / remove / rename a menu item you only touch that
 * config file — you never edit the component markup. These types describe the
 * shape of that config.
 * -------------------------------------------------------------------------
 */

import type { ComponentType } from "react";

/** Icon components are plain SVG React components (see icons.tsx). */
export type IconType = ComponentType<{ size?: number; className?: string }>;

/**
 * A single clickable navigation item (leaf node).
 */
export interface NavLeaf {
  kind: "leaf";
  /** Stable id — also used to map to the saved screenshot (e.g. "market-pulse" -> Marketpulse01.png). */
  id: string;
  /** Visible label, e.g. "Market Pulse". */
  label: string;
  /** Next.js route this item navigates to. */
  href: string;
  /** Icon component. */
  icon: IconType;
  /** Optional badge text, e.g. "NEW". */
  badge?: string;
}

/**
 * A collapsible group (e.g. "Stocks", "Index", "Games", "Videos").
 * Groups contain leaves and can be expanded / collapsed.
 */
export interface NavGroup {
  kind: "group";
  id: string;
  label: string;
  icon: IconType;
  /** Child items of this group. */
  children: NavLeaf[];
  /** Whether the group starts expanded. */
  defaultOpen?: boolean;
}

export type NavItem = NavLeaf | NavGroup;

/** Minimal shape of the signed-in user shown in the top bar. */
export interface SidebarUser {
  displayName: string;      // e.g. "guest_ub4irjo2ht" or a real username
  avatarUrl?: string;       // optional profile image
}
