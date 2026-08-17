"use client";

// ──────────────────────────────────────────────────────────────
// OrbitScore — the signature visual element of the product.
// A glowing ring (echoing "Orbital") that sweeps to the score,
// used on product cards, the dashboard, and store analytics
// anywhere the AI hands back a 0-100 opportunity/health score.
// ──────────────────────────────────────────────────────────────

export function OrbitScore({
  score,
  size = 64,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);

  const color =
    score >= 80 ? "#34D399" : score >= 60 ? "#2FD8E0" : score >= 40 ? "#F5B94D" : "#FB7185";

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)",
              filter: `drop-shadow(0 0 6px ${color}99)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-semibold tabular-nums" style={{ fontSize: size * 0.28, color }}>
            {score}
          </span>
        </div>
      </div>
      {label && <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">{label}</span>}
    </div>
  );
}
