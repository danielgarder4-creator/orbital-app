"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles, Loader2, Check, Lock } from "lucide-react";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useBillingStatus } from "@/lib/hooks/use-billing-status";
import type { GeneratedProductCopy } from "@/lib/ai/types";

interface DiscoveredProduct {
  id: string;
  title: string;
  imageUrl: string | null;
  supplier: string;
  costCents: number;
  suggestedPriceCents: number;
}

type Stage = "loading" | "ready" | "generating" | "reviewing" | "saving" | "published" | "blocked" | "error";

export default function ImportProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status: billing, refresh: refreshBilling } = useBillingStatus();

  const [stage, setStage] = useState<Stage>("loading");
  const [discovered, setDiscovered] = useState<DiscoveredProduct | null>(null);
  const [copy, setCopy] = useState<GeneratedProductCopy | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedProductId, setSavedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/products/discovered/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setStage("error");
          setErrorMsg("Product not found.");
          return;
        }
        setDiscovered(data.product);
        setStage("ready");
      });
  }, [id]);

  async function generateCopy() {
    if (!discovered) return;

    // Enforce the free-product gate BEFORE spending an AI call.
    if (billing && !billing.canImportProduct) {
      setStage("blocked");
      return;
    }

    setStage("generating");
    const res = await fetch("/api/ai/generate-product-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discoveredProductId: discovered.id, rawTitle: discovered.title }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStage("error");
      setErrorMsg(data.error ?? "Generation failed");
      return;
    }
    setCopy(data.copy);
    setIsDemo(data.demo);
    setStage("reviewing");
  }

  async function saveAndPublish() {
    if (!discovered || !copy) return;
    setStage("saving");

    const importRes = await fetch("/api/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discoveredProductId: discovered.id,
        title: copy.title,
        description: copy.description,
        bulletPoints: copy.bulletPoints,
        seoTitle: copy.seoTitle,
        seoDescription: copy.seoDescription,
        tags: copy.tags,
        collection: copy.suggestedCollection,
        costCents: discovered.costCents,
        priceCents: discovered.suggestedPriceCents,
      }),
    });
    const importData = await importRes.json();

    if (importRes.status === 402) {
      setStage("blocked");
      refreshBilling();
      return;
    }
    if (!importRes.ok) {
      setStage("error");
      setErrorMsg(importData.error ?? "Import failed");
      return;
    }

    const productId = importData.product.id;
    await fetch(`/api/products/${productId}/publish`, { method: "POST" });
    setSavedProductId(productId);
    refreshBilling();
    setStage("published");
  }

  if (stage === "loading") {
    return <div className="skeleton surface-card h-64" />;
  }

  if (stage === "error") {
    return <p className="text-sm text-signal-danger">{errorMsg}</p>;
  }

  if (stage === "blocked") {
    return (
      <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
        <Lock className="h-8 w-8 text-signal-warning" strokeWidth={1.5} />
        <h2 className="font-display text-lg font-medium">Free product already used</h2>
        <p className="max-w-sm text-sm text-ink-muted">
          You've used your free product. Upgrade to AI Pro to continue importing products.
        </p>
        <button onClick={() => router.push("/billing")} className="btn-primary">
          Upgrade to AI Pro — €60/month
        </button>
      </div>
    );
  }

  if (stage === "published") {
    return (
      <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
        <Check className="h-8 w-8 text-signal-success" strokeWidth={1.5} />
        <h2 className="font-display text-lg font-medium">Published to your store 🎉</h2>
        <button onClick={() => router.push("/products/mine")} className="btn-primary">
          View My Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Import Product</h1>
        <p className="mt-1 text-sm text-ink-muted">Generate AI copy, review, then publish.</p>
      </div>

      {discovered && (
        <div className="surface-card flex items-center gap-4 p-5">
          {discovered.imageUrl && (
            <img src={discovered.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
          )}
          <div>
            <p className="font-medium">{discovered.title}</p>
            <p className="text-xs text-ink-faint">{discovered.supplier}</p>
          </div>
        </div>
      )}

      {billing && !billing.canImportProduct && stage === "ready" && (
        <div className="surface-card border-signal-warning/25 bg-signal-warning/[0.04] p-4 text-sm">
          You've used your free product. Upgrade to AI Pro to continue importing products.
        </div>
      )}

      {(stage === "ready" || stage === "generating") && (
        <button onClick={generateCopy} disabled={stage === "generating"} className="btn-primary">
          {stage === "generating" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate Everything
        </button>
      )}

      {isDemo && copy && <DemoBadge />}

      {copy && (stage === "reviewing" || stage === "saving") && (
        <div className="surface-card space-y-5 p-6">
          <Field label="Title" defaultValue={copy.title} />
          <Field label="Description" defaultValue={copy.description} multiline />
          <div>
            <span className="text-xs font-medium text-ink-muted">Bullet points</span>
            <ul className="mt-2 space-y-1.5">
              {copy.bulletPoints.map((b) => (
                <li key={b} className="rounded-lg border border-border bg-surface-sunken px-3 py-2 text-sm">
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {copy.tags.map((t) => (
              <span key={t} className="rounded-pill border border-border px-2.5 py-1 text-xs text-ink-muted">
                #{t}
              </span>
            ))}
          </div>
          <button onClick={saveAndPublish} disabled={stage === "saving"} className="btn-primary w-full py-3">
            {stage === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Product"}
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, defaultValue, multiline = false }: { label: string; defaultValue: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {multiline ? (
        <textarea
          defaultValue={defaultValue}
          rows={4}
          className="mt-1.5 w-full resize-none rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-ink focus:border-orbit-violet/50 focus:outline-none"
        />
      ) : (
        <input
          defaultValue={defaultValue}
          className="mt-1.5 w-full rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-ink focus:border-orbit-violet/50 focus:outline-none"
        />
      )}
    </label>
  );
}
