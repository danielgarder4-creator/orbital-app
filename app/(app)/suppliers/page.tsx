const suppliers = [
  { name: "NovaGoods CN", region: "China", shipDays: "7–12 days", reliability: 91, categories: ["Tech", "Home"] },
  { name: "Meridian Wholesale", region: "EU", shipDays: "3–5 days", reliability: 96, categories: ["Fitness", "Beauty"] },
  { name: "Atlas Direct", region: "US", shipDays: "2–4 days", reliability: 89, categories: ["Home", "Kitchen"] },
  { name: "Pace Supply Co.", region: "China", shipDays: "8–14 days", reliability: 78, categories: ["Tech"] },
];

export default function SuppliersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Suppliers</h1>
        <p className="mt-1 text-sm text-ink-muted">AI-estimated reliability, sourced automatically during product research.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {suppliers.map((s) => (
          <div key={s.name} className="surface-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-medium">{s.name}</h3>
              <span className="data-figure text-sm text-signal-success">{s.reliability}%</span>
            </div>
            <p className="mt-1 text-xs text-ink-faint">{s.region} · ships in {s.shipDays}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {s.categories.map((c) => (
                <span key={c} className="rounded-pill border border-border px-2.5 py-1 text-xs text-ink-muted">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
