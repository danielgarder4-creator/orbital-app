"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { DemoBadge } from "@/components/ui/demo-badge";
import type { AdCopyResult } from "@/lib/ai/types";

const platforms = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "google", label: "Google" },
] as const;

export default function AiAdsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<(typeof platforms)[number]["id"]>("tiktok");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdCopyResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  async function generate() {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productTitle: title, productDescription: description, platform }),
      });
      const data = await res.json();
      setResult(data.ad);
      setIsDemo(data.demo);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI Ad Generator</h1>
        <p className="mt-1 text-sm text-ink-muted">Headlines, hooks, and full video scripts — per platform.</p>
      </div>

      <div className="surface-card space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`rounded-pill px-4 py-1.5 text-sm ${
                platform === p.id ? "bg-orbit-gradient text-void" : "border border-border text-ink-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title"
          className="w-full rounded-lg border border-border bg-surface-sunken px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-orbit-violet/50 focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short product description"
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-surface-sunken px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-orbit-violet/50 focus:outline-none"
        />
        <button onClick={generate} disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate {platforms.find((p) => p.id === platform)?.label} Ad
        </button>
      </div>

      {isDemo && result && <DemoBadge />}

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-card space-y-5 p-6">
            <Block title="Headlines" items={result.headlines} />
            <Block title="Hooks" items={result.hooks} />
            <Block title="CTAs" items={result.ctas} />
            <div>
              <h3 className="label-eyebrow">Primary text</h3>
              <p className="mt-2 text-sm text-ink-muted">{result.primaryText}</p>
            </div>
          </div>

          {result.videoScript && (
            <div className="surface-card p-6">
              <h3 className="label-eyebrow">Video script</h3>
              <div className="mt-3 space-y-3">
                <ScriptRow label="Hook" text={result.videoScript.hook} />
                <ScriptRow label="Problem" text={result.videoScript.problem} />
                <ScriptRow label="Product" text={result.videoScript.product} />
                <ScriptRow label="Benefits" text={result.videoScript.benefits.join(" · ")} />
                <ScriptRow label="CTA" text={result.videoScript.cta} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="label-eyebrow">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((i) => (
          <li key={i} className="rounded-lg border border-border bg-surface-sunken px-3 py-2 text-sm text-ink">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScriptRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-orbit-cyan">{label}</span>
      <p className="mt-1 text-sm text-ink-muted">{text}</p>
    </div>
  );
}
