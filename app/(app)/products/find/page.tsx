"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { ProductOpportunityCard } from "@/components/product/opportunity-card";
import { DemoBadge } from "@/components/ui/demo-badge";
import type { DiscoveredProductDTO } from "@/lib/ai/types";

const suggestions = [
  "Gym products under €30 with good profit potential",
  "Trending kitchen gadgets for small apartments",
  "Low-competition skincare tools for 2026",
];

export default function ProductFinderPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<DiscoveredProductDTO[] | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/find-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setProducts(data.products);
      setIsDemo(data.demo);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function goToImport(p: DiscoveredProductDTO) {
    router.push(`/products/import/${p.id}`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI Product Finder</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Describe what you're looking for — Orbital scores real opportunities for you.
        </p>
      </div>

      <div className="surface-card p-5">
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search(query)}
            placeholder="Find me products for gym enthusiasts under €30 that have good profit potential."
            className="flex-1 rounded-lg border border-border bg-surface-sunken px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-orbit-violet/50 focus:outline-none"
          />
          <button onClick={() => search(query)} disabled={loading} className="btn-primary px-5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Search
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                search(s);
              }}
              className="rounded-pill border border-border px-3 py-1.5 text-xs text-ink-muted hover:border-border-hover hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isDemo && products && <DemoBadge label="Demo results" />}
      {error && <p className="text-sm text-signal-danger">{error}</p>}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton surface-card h-40" />
          ))}
        </div>
      )}

      {!loading && products && (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <ProductOpportunityCard
              key={p.id}
              product={p}
              onAddToStore={goToImport}
              onGenerateEverything={goToImport}
            />
          ))}
        </div>
      )}

      {!loading && !products && (
        <div className="surface-card flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Sparkles className="h-8 w-8 text-ink-faint" strokeWidth={1.25} />
          <p className="text-sm text-ink-muted">Describe an audience or budget above to see AI-scored products.</p>
        </div>
      )}
    </div>
  );
}
