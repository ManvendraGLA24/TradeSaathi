"use client";

/**
 * Sidebar.tsx
 * -------------------------------------------------------------------------
 * TradeSaathi collapsible sidebar navigation (rebrand of the TradeFinder nav).
 *
 * - Data-driven: renders NAV_CONFIG (navConfig.ts). Edit the config, not this.
 * - Collapsible groups with open/close state.
 * - Premium items show a lock when the user isn't subscribed and route to
 *   /pricing instead of the gated page.
 * - Active route is highlighted via Next.js `usePathname`.
 *
 * Drop-in usage (App Router):
 *
 *   // app/(dashboard)/layout.tsx
 *   import { Sidebar } from "@/components/sidebar/Sidebar";
 *   export default function Layout({ children }) {
 *     return (
 *       <div style={{ display: "flex" }}>
 *         <Sidebar />
 *         <main style={{ flex: 1 }}>{children}</main>
 *       </div>
 *     );
 *   }
 *
 * If you are NOT on Next.js, see README for the 2-line swap (Link -> <a>,
 * usePathname -> your router's current path).
 * -------------------------------------------------------------------------
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Sidebar.module.css";
import { NAV_CONFIG } from "./navConfig";
import type { NavItem, NavLeaf, NavGroup, SidebarUser } from "./types";
import { useSubscription } from "./useSubscription";
import { Logo } from "./Logo";
import { ChevronIcon, LockIcon, CloseIcon } from "./icons";

export interface SidebarProps {
  /** Supply the user (e.g. from SSR) to skip the client fetch. Optional. */
  user?: SidebarUser;
  /** Where locked premium items send the user. Default: "/pricing". */
  upgradeHref?: string;
  /** Mobile: whether the drawer is open. */
  open?: boolean;
  /** Mobile: called when the user taps the close button / backdrop. */
  onClose?: () => void;
}

export function Sidebar({
  user,
  upgradeHref = "/pricing",
  open = true,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { user: me, isLocked } = useSubscription(user);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.header}>
          <Logo />
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
              <CloseIcon size={20} />
            </button>
          )}
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_CONFIG.map((item) =>
            item.kind === "group" ? (
              <Group
                key={item.id}
                group={item}
                pathname={pathname}
                isLocked={isLocked}
                upgradeHref={upgradeHref}
              />
            ) : (
              <Leaf
                key={item.id}
                leaf={item}
                pathname={pathname}
                isLocked={isLocked}
                upgradeHref={upgradeHref}
              />
            )
          )}
        </nav>

        <SubscriptionFooter user={me} upgradeHref={upgradeHref} />
      </aside>
    </>
  );
}

/* ----------------------------- Group ---------------------------------- */

function Group({
  group,
  pathname,
  isLocked,
  upgradeHref,
}: {
  group: NavGroup;
  pathname: string;
  isLocked: (p?: boolean) => boolean;
  upgradeHref: string;
}) {
  // A group is "active" when one of its children is the current route.
  const childActive = useMemo(
    () => group.children.some((c) => pathname === c.href),
    [group.children, pathname]
  );
  const [open, setOpen] = useState(group.defaultOpen ?? childActive);
  const Icon = group.icon;

  return (
    <div className={styles.group}>
      <button
        className={styles.groupHeader}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.itemIcon}>
          <Icon size={20} />
        </span>
        <span className={styles.itemLabel}>{group.label}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
          <ChevronIcon size={16} />
        </span>
      </button>

      <div className={`${styles.groupBody} ${open ? styles.groupBodyOpen : ""}`}>
        <div className={styles.groupBodyInner}>
          {group.children.map((c) => (
            <Leaf
              key={c.id}
              leaf={c}
              pathname={pathname}
              isLocked={isLocked}
              upgradeHref={upgradeHref}
              nested
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Leaf ---------------------------------- */

function Leaf({
  leaf,
  pathname,
  isLocked,
  upgradeHref,
  nested = false,
}: {
  leaf: NavLeaf;
  pathname: string;
  isLocked: (p?: boolean) => boolean;
  upgradeHref: string;
  nested?: boolean;
}) {
  const locked = isLocked(leaf.premium);
  const active = pathname === leaf.href;
  const Icon = leaf.icon;

  // Locked premium items send the user to the upgrade page instead.
  const href = locked ? `${upgradeHref}?feature=${leaf.id}` : leaf.href;

  return (
    <Link
      href={href}
      className={[
        styles.item,
        nested ? styles.itemNested : "",
        active ? styles.itemActive : "",
        locked ? styles.itemLocked : "",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
      title={locked ? `${leaf.label} — upgrade to unlock` : leaf.label}
    >
      <span className={styles.itemIcon}>
        <Icon size={20} />
      </span>
      <span className={styles.itemLabel}>{leaf.label}</span>
      {leaf.badge && <span className={styles.badge}>{leaf.badge}</span>}
      {locked && (
        <span className={styles.lock} aria-label="Premium feature">
          <LockIcon size={15} />
        </span>
      )}
    </Link>
  );
}

/* ------------------------- Footer (upsell) ---------------------------- */

function SubscriptionFooter({ user, upgradeHref }: { user: SidebarUser; upgradeHref: string }) {
  if (user.isSubscribed) {
    return (
      <div className={styles.footer}>
        <div className={styles.planPill}>{(user.plan ?? "pro").toUpperCase()} PLAN</div>
      </div>
    );
  }
  return (
    <div className={styles.footer}>
      <Link href={upgradeHref} className={styles.upgradeBtn}>
        Unlock Premium
      </Link>
    </div>
  );
}
