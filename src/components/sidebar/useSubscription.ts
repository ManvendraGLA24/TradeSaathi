/**
 * useSubscription.ts
 * -------------------------------------------------------------------------
 * Supplies the static demo profile shown in the dashboard shell.
 * -------------------------------------------------------------------------
 */

import { useState } from "react";
import type { SidebarUser } from "./types";

const GUEST: SidebarUser = {
  displayName: "guest",
};

export function useSubscription(initial?: SidebarUser) {
  const [user, setUser] = useState<SidebarUser>(initial ?? GUEST);
  return { user, loading: false, setUser };
}
