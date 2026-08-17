import Link from "next/link";
import { OrbitScore } from "@/components/ui/orbit-score";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="label-eyebrow inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1">
          Your first product is free
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Your AI-Powered
          <br />
          <span className="bg-orbit-gradient bg-clip-text text-transparent">Dropshipping Business.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base text-ink-muted sm:text-lg">
          Find winning products, build your store, create your marketing and launch faster —
          with AI doing the heavy lifting.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="btn-primary px-7 py-3 text-base">
            Start For Free
          </Link>
          <a href="#how-it-works" className="btn-secondary px-7 py-3 text-base">
            See How It Works
          </a>
        </div>
      </div>

      <ProductFinderPreview />
    </section>
  );
}

function ProductFinderPreview() {
  const rows = [
    { name: "Compact Massage Gun", supplier: "Meridian Wholesale", cost: "€14.20", price: "€38.00", score: 92 },
    { name: "Ceramic Pour-Over Kettle", supplier: "Atlas Direct", cost: "€9.80", price: "€27.50", score: 84 },
    { name: "Magnetic Cable Organizer", supplier: "NovaGoods CN", cost: "€3.10", price: "€12.90", score: 71 },
  ];

  return (
    <div className="relative mx-auto mt-16 max-w-4xl animate-rise-in [animation-delay:150ms]">
      <div className="absolute -inset-x-10 -top-10 h-40 bg-orbit-gradient opacity-[0.12] blur-3xl" />
      <div className="surface-card relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <span className="ml-3 text-xs font-mono text-ink-faint">AI Product Finder</span>
          </div>
          <span className="rounded-pill bg-orbit-violet/10 px-2.5 py-1 text-[11px] font-mono text-orbit-violet">
            live query
          </span>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-ink-muted">
            <span className="text-orbit-cyan">✦</span>
            "Find me products for gym enthusiasts under €30 with good profit potential"
          </div>
        </div>

        <div className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.name} className="flex items-center gap-4 px-5 py-3.5">
              <div className="h-11 w-11 flex-shrink-0 rounded-lg bg-surface-raised" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{r.name}</p>
                <p className="text-xs text-ink-faint">{r.supplier}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="data-figure text-xs text-ink-faint">cost {r.cost}</p>
                <p className="data-figure text-sm text-ink">{r.price}</p>
              </div>
              <OrbitScore score={r.score} size={44} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
