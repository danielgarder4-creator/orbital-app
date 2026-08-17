import { Zap } from "lucide-react";

const automations = [
  { name: "Auto-optimize underperforming products", desc: "Flags products with conversion below 1.5% and suggests price or copy changes.", active: true },
  { name: "Restock alerts", desc: "Notifies you when a supplier's stock estimate drops below 2 weeks.", active: true },
  { name: "Weekly opportunity digest", desc: "Sends a curated list of new high-scoring products every Monday.", active: false },
  { name: "Auto-generate ads for new products", desc: "Creates Facebook + TikTok ad copy the moment a product is published.", active: false },
];

export default function AutomationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Automations</h1>
        <p className="mt-1 text-sm text-ink-muted">Let Orbital act on your behalf while you're away.</p>
      </div>

      <div className="surface-card divide-y divide-border">
        {automations.map((a) => (
          <div key={a.name} className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-raised text-orbit-cyan">
              <Zap className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{a.name}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{a.desc}</p>
            </div>
            <button
              className={`relative h-6 w-11 flex-shrink-0 rounded-pill transition-colors ${a.active ? "bg-orbit-gradient" : "bg-surface-raised"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${a.active ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
