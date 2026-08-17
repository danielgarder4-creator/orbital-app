"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { DemoBadge } from "@/components/ui/demo-badge";
import type { GeneratedStore } from "@/lib/ai/types";

export default function StoreBuilderPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<GeneratedStore | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  async function generate() {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      setStore(data.store);
      setIsDemo(data.demo);
      setPublished(false);
    } finally {
      setLoading(false);
    }
  }

  async function publish() {
    if (!store) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      if (res.ok) setPublished(true);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI Store Builder</h1>
        <p className="mt-1 text-sm text-ink-muted">Describe your brand — Orbital designs the store.</p>
      </div>

      <div className="surface-card p-5">
        <div className="flex gap-3">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="A luxury skincare store targeting women aged 18-30"
            className="flex-1 rounded-lg border border-border bg-surface-sunken px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-orbit-violet/50 focus:outline-none"
          />
          <button onClick={generate} disabled={loading} className="btn-primary px-5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Store
          </button>
        </div>
      </div>

      {isDemo && store && <DemoBadge />}

      {store && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="surface-card overflow-hidden lg:col-span-2">
            <div
              className="p-10 text-center"
              style={{ background: `linear-gradient(135deg, ${store.primaryColor}, ${store.accentColor}22)` }}
            >
              <p className="font-display text-3xl font-semibold text-white">{store.storeName}</p>
              <p className="mt-2 text-sm text-white/80">{store.tagline}</p>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <h3 className="label-eyebrow">Homepage</h3>
                <p className="mt-2 font-display text-lg font-medium">{store.homepage.headline}</p>
                <p className="mt-1 text-sm text-ink-muted">{store.homepage.subheadline}</p>
              </div>
              <div>
                <h3 className="label-eyebrow">About</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{store.aboutPage}</p>
              </div>
              <div>
                <h3 className="label-eyebrow">FAQ</h3>
                <div className="mt-2 space-y-3">
                  {store.faq.map((f) => (
                    <div key={f.question}>
                      <p className="text-sm font-medium">{f.question}</p>
                      <p className="text-sm text-ink-muted">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card p-6">
              <h3 className="label-eyebrow">Brand colors</h3>
              <div className="mt-3 flex gap-3">
                <div className="h-14 w-14 rounded-lg" style={{ background: store.primaryColor }} />
                <div className="h-14 w-14 rounded-lg" style={{ background: store.accentColor }} />
              </div>
              <p className="mt-3 text-xs text-ink-faint">{store.logoConcept}</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="label-eyebrow">Collections</h3>
              <ul className="mt-3 space-y-2">
                {store.collections.map((c) => (
                  <li key={c} className="rounded-lg border border-border bg-surface-sunken px-3 py-2 text-sm">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={publish} disabled={publishing || published} className="btn-primary w-full">
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : published ? (
                <>
                  <Check className="h-4 w-4" /> Published
                </>
              ) : (
                "Publish Store"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
