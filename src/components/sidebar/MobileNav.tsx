"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Sidebar.module.css";
import { NAV_CONFIG } from "./navConfig";
import type { IconType, NavGroup, NavLeaf } from "./types";
import {
  CloseIcon,
  HomeIcon,
  IndexIcon,
  MoreIcon,
  StocksIcon,
  ToolsIcon,
} from "./icons";

const leaves: NavLeaf[] = NAV_CONFIG.flatMap((item) =>
  item.kind === "group" ? item.children : [item]
);

function findGroup(id: string): NavGroup | undefined {
  return NAV_CONFIG.find(
    (item): item is NavGroup => item.kind === "group" && item.id === id
  );
}

function findLeaves(ids: string[]): NavLeaf[] {
  return leaves.filter((leaf) => ids.includes(leaf.id));
}

interface MobileTab {
  id: string;
  label: string;
  icon: IconType;
  items: NavLeaf[];
}

const mobileTabs: MobileTab[] = [
  { id: "stocks", label: "Stocks", icon: StocksIcon, items: findGroup("stocks")?.children ?? [] },
  { id: "index", label: "Index", icon: IndexIcon, items: findGroup("index")?.children ?? [] },
  {
    id: "tools",
    label: "Tools",
    icon: ToolsIcon,
    items: findLeaves(["fii-dii", "community", "trading-journal", "watchlist", "calculator"]),
  },
  {
    id: "more",
    label: "More",
    icon: MoreIcon,
    items: findLeaves(["flip-it", "trade-titans", "tutorials", "webinars", "feedback", "settings"]),
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const activeMenu = mobileTabs.find((tab) => tab.id === activeTab);

  return (
    <div className={styles.mobileNav}>
      {activeMenu && (
        <>
          <button
            type="button"
            className={styles.mobileNavBackdrop}
            aria-label="Close navigation menu"
            onClick={() => setActiveTab(null)}
          />
          <section
            id="mobile-nav-panel"
            className={styles.mobileNavPanel}
            aria-label={`${activeMenu.label} navigation`}
          >
            <header className={styles.mobileNavPanelHeader}>
              <h2>{activeMenu.label}</h2>
              <button
                type="button"
                className={styles.mobileNavClose}
                aria-label="Close navigation menu"
                onClick={() => setActiveTab(null)}
              >
                <CloseIcon size={18} />
              </button>
            </header>
            <div className={styles.mobileNavLinks}>
              {activeMenu.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`${styles.mobileNavLink} ${active ? styles.mobileNavLinkActive : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setActiveTab(null)}
                  >
                    <Icon size={19} />
                    <span className={styles.mobileNavLinkLabel}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}

      <nav className={styles.mobileNavBar} aria-label="Quick navigation">
        {mobileTabs.slice(0, 2).map((tab) => (
          <MobileNavButton
            key={tab.id}
            tab={tab}
            active={tab.items.some((item) => pathname === item.href)}
            expanded={activeTab === tab.id}
            onClick={() => setActiveTab((current) => (current === tab.id ? null : tab.id))}
          />
        ))}

        <Link
          href="/"
          className={`${styles.mobileNavButton} ${pathname === "/" ? styles.mobileNavButtonActive : ""}`}
          aria-current={pathname === "/" ? "page" : undefined}
          onClick={() => setActiveTab(null)}
        >
          <HomeIcon size={21} />
          <span>Home</span>
        </Link>

        {mobileTabs.slice(2).map((tab) => (
          <MobileNavButton
            key={tab.id}
            tab={tab}
            active={tab.items.some((item) => pathname === item.href)}
            expanded={activeTab === tab.id}
            onClick={() => setActiveTab((current) => (current === tab.id ? null : tab.id))}
          />
        ))}
      </nav>
    </div>
  );
}

function MobileNavButton({
  tab,
  active,
  expanded,
  onClick,
}: {
  tab: MobileTab;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      className={`${styles.mobileNavButton} ${active || expanded ? styles.mobileNavButtonActive : ""}`}
      aria-expanded={expanded}
      aria-controls="mobile-nav-panel"
      onClick={onClick}
    >
      <Icon size={21} />
      <span>{tab.label}</span>
    </button>
  );
}
