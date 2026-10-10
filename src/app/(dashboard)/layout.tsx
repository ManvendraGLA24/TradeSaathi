"use client";

/**
 * Dashboard layout (App Router)
 * -------------------------------------------------------------------------
 * Wraps every feature page with the TradeSaathi Sidebar + Topbar.
 * Put all gated/app pages under app/(dashboard)/... and they inherit this shell.
 * -------------------------------------------------------------------------
 */

import { useState } from "react";
import { MobileNav, Sidebar, Topbar, useSubscription } from "@/components/sidebar";
import shell from "@/components/ui/shell.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSubscription();

  return (
    <div className={shell.root}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className={shell.main}>
        <Topbar user={user} notificationCount={3} onToggleMenu={() => setMenuOpen(true)} />
        <main className={shell.content}>{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
