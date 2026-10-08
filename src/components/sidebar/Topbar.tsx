"use client";

/**
 * Topbar.tsx
 * -------------------------------------------------------------------------
 * The slim top bar from the reference: notification bell + "SIGNED IN"
 * user chip with a dropdown caret. Pair it with <Sidebar /> in your layout.
 * -------------------------------------------------------------------------
 */

import styles from "./Sidebar.module.css";
import { BellIcon, ChevronIcon } from "./icons";
import type { SidebarUser } from "./types";

export interface TopbarProps {
  user: SidebarUser;
  notificationCount?: number;
  onToggleMenu?: () => void; // mobile hamburger
}

export function Topbar({ user, notificationCount = 0, onToggleMenu }: TopbarProps) {
  const initials =
    user.displayName
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <header className={styles.topbar}>
      {onToggleMenu && (
        <button className={styles.hamburger} onClick={onToggleMenu} aria-label="Open menu">
          <span /><span /><span />
        </button>
      )}

      <div className={styles.topbarRight}>
        <button className={styles.bell} aria-label="Notifications">
          <BellIcon size={20} />
          {notificationCount > 0 && (
            <span className={styles.bellDot}>{notificationCount > 9 ? "9+" : notificationCount}</span>
          )}
        </button>

        <button className={styles.userChip}>
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className={styles.avatar} />
          ) : (
            <span className={styles.avatarFallback}>{initials}</span>
          )}
          <span className={styles.userMeta}>
            <span className={styles.userStatus}>SIGNED IN</span>
            <span className={styles.userName}>{user.displayName}</span>
          </span>
          <ChevronIcon size={16} />
        </button>
      </div>
    </header>
  );
}
