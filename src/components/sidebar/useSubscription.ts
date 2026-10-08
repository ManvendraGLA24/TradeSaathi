/**
 * useSubscription.ts
 * -------------------------------------------------------------------------
 * Tells the sidebar whether the current user may open premium features.
 *
 * The lock icon in the UI is ONLY a visual hint. Real access control must be
 * enforced on your backend / API layer (see the security note in README).
 * This hook just answers: "should this item be gated in the UI right now?"
 *
 * How it ties into Angel One:
 *   - Angel One SmartAPI is your MARKET-DATA / order source. It does NOT know
 *     who paid for TradeSaathi.
 *   - Subscription status should come from YOUR OWN backend (the service that
 *     holds the Angel One session token and serves /data/* endpoints), e.g.
 *     GET /api/me  ->  { isSubscribed, plan, expiry }
 *   - Plug that call in below. A static default is provided so the component
 *     renders out-of-the-box.
 * -------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import type { SidebarUser } from "./types";

const GUEST: SidebarUser = {
  displayName: "guest",
  isSubscribed: false,
  plan: "free",
};

/**
 * Replace the body of `fetchMe` with a real call to your backend.
 * Keep the shape (`SidebarUser`) the same and the sidebar needs no changes.
 */
async function fetchMe(): Promise<SidebarUser> {
  // --- EXAMPLE (uncomment & point at your backend) -----------------------
  // const res = await fetch("/api/me", { credentials: "include" });
  // if (!res.ok) return GUEST;
  // const u = await res.json();
  // return {
  //   displayName: u.username,
  //   avatarUrl: u.avatarUrl,
  //   isSubscribed: Boolean(u.isSubscribed) && new Date(u.expiry) > new Date(),
  //   plan: u.plan,
  // };
  // -----------------------------------------------------------------------
  return GUEST;
}

export function useSubscription(initial?: SidebarUser) {
  const [user, setUser] = useState<SidebarUser>(initial ?? GUEST);
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return; // caller already supplied the user (e.g. from SSR)
    let alive = true;
    fetchMe()
      .then((u) => alive && setUser(u))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [initial]);

  /** A premium item is locked only when the feature is premium AND the user is not subscribed. */
  const isLocked = (premium?: boolean) => Boolean(premium) && !user.isSubscribed;

  return { user, loading, isLocked, setUser };
}
