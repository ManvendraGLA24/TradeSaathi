"use client";

/**
 * Sidebar.tsx
 * -------------------------------------------------------------------------
 * TradeSaathi collapsible sidebar navigation (rebrand of the TradeFinder nav).
 *
 * - Data-driven: renders NAV_CONFIG (navConfig.ts). Edit the config, not this.
 * - Collapsible groups with open/close state.
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
import type { NavLeaf, NavGroup } from "./types";
import { Logo } from "./Logo";
import { ChevronIcon, CloseIcon } from "./icons";

export interface SidebarProps {
  /** Mobile: whether the drawer is open. */
  open?: boolean;
  /** Mobile: called when the user taps the close button / backdrop. */
  onClose?: () => void;
}

export function Sidebar({
  open = true,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

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
                onNavigate={onClose}
              />
            ) : (
              <Leaf
                key={item.id}
                leaf={item}
                pathname={pathname}
                onNavigate={onClose}
              />
            )
          )}
        </nav>

      </aside>
    </>
  );
}

/* ----------------------------- Group ---------------------------------- */

function Group({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate?: () => void;
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
              onNavigate={onNavigate}
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
  onNavigate,
  nested = false,
}: {
  leaf: NavLeaf;
  pathname: string;
  onNavigate?: () => void;
  nested?: boolean;
}) {
  const active = pathname === leaf.href;
  const Icon = leaf.icon;

  return (
    <Link
      href={leaf.href}
      className={[
        styles.item,
        nested ? styles.itemNested : "",
        active ? styles.itemActive : "",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
      title={leaf.label}
      onClick={onNavigate}
    >
      <span className={styles.itemIcon}>
        <Icon size={20} />
      </span>
      <span className={styles.itemLabel}>{leaf.label}</span>
      {leaf.badge && <span className={styles.badge}>{leaf.badge}</span>}
    </Link>
  );
}
