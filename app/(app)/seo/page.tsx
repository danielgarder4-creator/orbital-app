const rows = [
  { product: "Compact Massage Gun", title: "Compact Massage Gun | Fast Shipping", score: 88 },
  { product: "Ceramic Pour-Over Kettle", title: "Ceramic Pour-Over Kettle | Fast Shipping", score: 76 },
  { product: "Magnetic Cable Organizer", title: "Magnetic Cable Organizer | Fast Shipping", score: 63 },
];

export default function SeoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">SEO</h1>
        <p className="mt-1 text-sm text-ink-muted">AI-generated metadata and per-product SEO health.</p>
      </div>

      <div className="surface-card divide-y divide-border">
        {rows.map((r) => (
          <div key={r.product} className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">{r.product}</p>
              <p className="truncate text-xs text-ink-faint">{r.title}</p>
            </div>
            <span
              className={`data-figure flex-shrink-0 rounded-pill px-2.5 py-1 text-xs ${
                r.score >= 80 ? "bg-signal-success/10 text-signal-success" : r.score >= 60 ? "bg-signal-warning/10 text-signal-warning" : "bg-signal-danger/10 text-signal-danger"
              }`}
            >
              {r.score}/100
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
