"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { PLANS } from "@/lib/stripe/client";
import { useBillingStatus } from "@/lib/hooks/use-billing-status";

export default function BillingPage() {
  const { status, loading: statusLoading } = useBillingStatus();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function upgrade() {
    setCheckoutLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.demo) {
        setNotice(data.error);
        return;
      }
      window.location.href = data.url;
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (statusLoading || !status) {
    return <div className="skeleton surface-card h-48 max-w-3xl" />;
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Billing</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage your plan and payment method.</p>
      </div>

      {status.plan === "FREE" && (
        <div className="surface-card border-signal-warning/25 bg-signal-warning/[0.04] p-4 text-sm text-ink">
          {status.freeProductUsed
            ? "You've used your free product. Upgrade to AI Pro to continue importing products."
            : "1 free product remaining."}
        </div>
      )}

      <div className="surface-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted">Current plan</p>
            <p className="mt-1 font-display text-xl font-semibold">
              {status.plan === "PRO" ? PLANS.PRO.name : PLANS.FREE.name}
            </p>
          </div>
          <span className="rounded-pill bg-surface-raised px-3 py-1 text-xs font-mono text-ink-muted">
            {status.plan === "PRO" ? status.status : "No subscription"}
          </span>
        </div>

        {status.plan === "FREE" ? (
          <button onClick={upgrade} disabled={checkoutLoading} className="btn-primary mt-6">
            {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            Upgrade to AI Pro — €60/month
          </button>
        ) : (
          <div className="mt-6 flex gap-3">
            <button className="btn-secondary">Update payment method</button>
            <button className="btn-ghost text-signal-danger">Cancel subscription</button>
          </div>
        )}

        {notice && (
          <p className="mt-4 rounded-lg border border-signal-info/25 bg-signal-info/5 p-3 text-xs text-ink-muted">
            {notice}
          </p>
        )}
      </div>

      <div className="surface-card p-6">
        <h3 className="font-display text-sm font-medium">Payment history</h3>
        <p className="mt-3 text-sm text-ink-faint">No payments yet.</p>
      </div>
    </div>
  );
}
