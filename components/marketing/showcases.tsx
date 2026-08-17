import { SectionHeading } from "./sections";
import { OrbitScore } from "@/components/ui/orbit-score";

export function StoreBuilderShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <span className="label-eyebrow">AI Store Builder</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Describe your brand. Get a store.
          </h2>
          <p className="mt-4 text-ink-muted">
            Type a single sentence about who you're selling to, and Orbital generates a name, logo
            concept, color system, homepage copy, and product collections — ready to customize in
            a visual editor.
          </p>
          <div className="mt-6 rounded-lg border border-border bg-surface-sunken px-4 py-3 text-sm text-ink-muted">
            <span className="text-orbit-cyan">✦</span> "A luxury skincare store targeting women aged 18–30"
          </div>
        </div>
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 rounded bg-orbit-gradient opacity-90" />
            <div className="flex gap-2">
              <span className="h-6 w-6 rounded bg-surface-raised" />
              <span className="h-6 w-6 rounded bg-surface-raised" />
            </div>
          </div>
          <div className="mt-6 h-28 rounded-lg bg-gradient-to-br from-orbit-violet/20 to-orbit-cyan/10" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-surface-raised" />
            <div className="h-16 rounded-lg bg-surface-raised" />
            <div className="h-16 rounded-lg bg-surface-raised" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketingShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="surface-card order-2 p-6 md:order-1">
          <p className="label-eyebrow">TikTok script</p>
          <div className="mt-3 space-y-2.5 text-sm">
            <ScriptLine tag="Hook" text="Stop scrolling if you've been dealing with this..." />
            <ScriptLine tag="Problem" text="You've tried everything and nothing quite fits your routine." />
            <ScriptLine tag="Product" text="That's exactly why we made this." />
            <ScriptLine tag="CTA" text="Link in bio — while stock lasts." />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <span className="label-eyebrow">AI Marketing</span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Ad copy that sounds like a person wrote it.
          </h2>
          <p className="mt-4 text-ink-muted">
            Generate Facebook, Instagram, TikTok, and Google ad copy — headlines, hooks, full video
            scripts, and CTAs — from a single product description.
          </p>
        </div>
      </div>
    </section>
  );
}

function ScriptLine({ tag, text }: { tag: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-orbit-cyan">{tag}</span>
      <p className="mt-1 text-ink-muted">{text}</p>
    </div>
  );
}

export function AnalyticsShowcase() {
  const products = [
    { name: "Compact Massage Gun", margin: 62, score: 92 },
    { name: "Ceramic Pour-Over Kettle", margin: 58, score: 84 },
    { name: "LED Vanity Mirror", margin: 49, score: 67 },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Product Analytics"
        title="Know what's working before you spend more on ads."
        body="Revenue, conversion, and margin per product, tracked automatically as orders come in."
      />
      <div className="surface-card mx-auto mt-14 max-w-3xl divide-y divide-border">
        {products.map((p) => (
          <div key={p.name} className="flex items-center gap-4 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="data-figure text-xs text-ink-faint">{p.margin}% margin</p>
            </div>
            <OrbitScore score={p.score} size={40} />
          </div>
        ))}
      </div>
    </section>
  );
}
