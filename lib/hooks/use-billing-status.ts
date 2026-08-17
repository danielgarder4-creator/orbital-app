"use client";

import { useEffect, useState } from "react";

export interface BillingStatus {
  plan: "FREE" | "PRO";
  status: string;
  freeProductUsed: boolean;
  canImportProduct: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
}

/** Fetches /api/billing/status once on mount. Call `refresh()` after
 *  an action that changes plan/usage (e.g. importing a product). */
export function useBillingStatus() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/status");
      if (res.ok) setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, loading, refresh };
}
