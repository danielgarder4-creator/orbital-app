"use client";

import { OrbitScore } from "@/components/ui/orbit-score";
import type { DiscoveredProductDTO } from "@/lib/ai/types";
import { Sparkles, Plus, SearchCheck } from "lucide-react";

function eur(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

const competitionColor: Record<string, string> = {
  LOW: "text-signal-success bg-signal-success/10",
  MEDIUM: "text-signal-warning bg-signal-warning/10",
  HIGH: "text-signal-danger bg-signal-danger/10",
};

export function ProductOpportunityCard({
  product,
  onAnalyze,
  onAddToStore,
  onGenerateEverything,
}: {
  product: DiscoveredProductDTO;
  onAnalyze?: (p: DiscoveredProductDTO) => void;
  onAddToStore?: (p: DiscoveredProductDTO) => void;
  onGenerateEverything?: (p: DiscoveredProductDTO) => void;
}) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex gap-4 p-5">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-20 w-20 flex-shrink-0 rounded-lg bg-surface-raised object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="truncate font-display text-sm font-medium">{product.title}</h3>
              <p className="text-xs text-ink-faint">{product.supplier}</p>
            </div>
            <OrbitScore score={product.opportunityScore} size={48} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className="data-figure text-ink-muted">cost {eur(product.costCents)}</span>
            <span className="data-figure text-ink">sell {eur(product.suggestedPriceCents)}</span>
            <span className="data-figure text-signal-success">+{eur(product.estimatedProfitCents)} profit</span>
            <span className={`rounded-pill px-2 py-0.5 font-mono ${competitionColor[product.competition]}`}>
              {product.competition} competition
            </span>
          </div>
        </div>
      </div>

      <p className="border-t border-border px-5 py-3 text-xs leading-relaxed text-ink-muted">
        {product.aiRecommendation}
      </p>

      <div className="flex divide-x divide-border border-t border-border">
        <button onClick={() => onAnalyze?.(product)} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs text-ink-muted hover:bg-surface-raised hover:text-ink">
          <SearchCheck className="h-3.5 w-3.5" /> Analyze
        </button>
        <button onClick={() => onAddToStore?.(product)} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs text-ink-muted hover:bg-surface-raised hover:text-ink">
          <Plus className="h-3.5 w-3.5" /> Add To Store
        </button>
        <button onClick={() => onGenerateEverything?.(product)} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-orbit-cyan hover:bg-surface-raised">
          <Sparkles className="h-3.5 w-3.5" /> Generate Everything
        </button>
      </div>
    </div>
  );
}
