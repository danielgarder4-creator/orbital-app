import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  positive?: boolean;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">{label}</span>
        <Icon className="h-4 w-4 text-ink-faint" strokeWidth={1.75} />
      </div>
      <p className="data-figure mt-3 text-2xl font-semibold text-ink">{value}</p>
      {delta && (
        <p className={`mt-1.5 text-xs font-mono ${positive ? "text-signal-success" : "text-signal-danger"}`}>
          {delta}
        </p>
      )}
    </div>
  );
}
