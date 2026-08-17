"use client";

import { useState } from "react";
import { Upload, Wand2 } from "lucide-react";

const styles = ["Studio", "Lifestyle", "Social", "Advertisement"];
const backgrounds = ["Clean white", "Marble surface", "Outdoor lifestyle", "Gradient"];

export default function AiContentPage() {
  const [style, setStyle] = useState(styles[0]);
  const [background, setBackground] = useState(backgrounds[0]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">AI Creative Studio</h1>
        <p className="mt-1 text-sm text-ink-muted">Turn one product photo into a full creative set.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface-card flex flex-col items-center justify-center gap-3 p-10 text-center lg:col-span-1">
          <Upload className="h-8 w-8 text-ink-faint" strokeWidth={1.25} />
          <p className="text-sm text-ink-muted">Drop a product photo, or click to upload</p>
          <button className="btn-secondary mt-2">Choose File</button>
        </div>

        <div className="surface-card space-y-6 p-6 lg:col-span-2">
          <div>
            <span className="label-eyebrow">Style</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded-pill px-3.5 py-1.5 text-sm ${
                    style === s ? "bg-orbit-gradient text-void" : "border border-border text-ink-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="label-eyebrow">Background</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {backgrounds.map((b) => (
                <button
                  key={b}
                  onClick={() => setBackground(b)}
                  className={`rounded-pill px-3.5 py-1.5 text-sm ${
                    background === b ? "bg-orbit-gradient text-void" : "border border-border text-ink-muted"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-ink-muted">Lighting</span>
              <select className="mt-1.5 w-full rounded-lg border border-border bg-surface-sunken px-3 py-2 text-sm">
                <option>Soft studio</option>
                <option>Golden hour</option>
                <option>Dramatic</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Aspect ratio</span>
              <select className="mt-1.5 w-full rounded-lg border border-border bg-surface-sunken px-3 py-2 text-sm">
                <option>1:1</option>
                <option>4:5</option>
                <option>16:9</option>
                <option>9:16</option>
              </select>
            </label>
          </div>
          <button className="btn-primary">
            <Wand2 className="h-4 w-4" /> Generate {style} Images
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card flex aspect-square items-center justify-center bg-surface-raised text-xs text-ink-faint">
            Generated image {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
