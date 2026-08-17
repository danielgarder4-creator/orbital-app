export function DemoBadge({ label = "Demo data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-signal-warning/30 bg-signal-warning/10 px-2.5 py-1 text-[11px] font-mono text-signal-warning">
      <span className="h-1.5 w-1.5 rounded-full bg-signal-warning" />
      {label} — connect an AI provider in .env to go live
    </span>
  );
}
