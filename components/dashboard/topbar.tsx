import { Search, Bell, Command } from "lucide-react";

export function Topbar({ plan = "FREE", userName }: { plan?: "FREE" | "PRO"; userName?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-void/80 px-6 backdrop-blur-xl">
      <button className="flex w-72 items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink-faint transition-colors hover:border-border-hover">
        <Search className="h-4 w-4" />
        Search products, orders…
        <span className="ml-auto flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 text-[10px] font-mono">
          <Command className="h-3 w-3" />K
        </span>
      </button>

      <div className="flex items-center gap-4">
        <span
          className={`rounded-pill px-3 py-1 text-xs font-mono ${
            plan === "PRO" ? "bg-orbit-violet/15 text-orbit-violet" : "bg-surface-raised text-ink-muted"
          }`}
        >
          {plan === "PRO" ? "AI Pro" : "Free plan"}
        </span>
        <button className="relative text-ink-muted hover:text-ink">
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orbit-cyan" />
        </button>
        <div className="h-8 w-8 rounded-full bg-orbit-gradient" />
      </div>
    </header>
  );
}
