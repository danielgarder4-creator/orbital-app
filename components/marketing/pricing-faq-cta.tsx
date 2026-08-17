"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionHeading } from "./sections";
import { PLANS } from "@/lib/stripe/client";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="Pricing" title="Simple pricing. Serious leverage." />
      <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div className="surface-card p-8">
          <h3 className="font-display text-lg font-medium">{PLANS.FREE.name}</h3>
          <p className="mt-1 text-sm text-ink-muted">Try Orbital with zero risk.</p>
          <p className="mt-6 font-display text-4xl font-semibold">
            {PLANS.FREE.priceLabel}
            <span className="text-base font-normal text-ink-faint"> forever</span>
          </p>
          <Link href="/signup" className="btn-secondary mt-6 w-full">
            Start Free
          </Link>
          <ul className="mt-7 space-y-3">
            {PLANS.FREE.features.map((f) => (
              <FeatureLine key={f} label={f} />
            ))}
          </ul>
        </div>

        <div className="surface-card relative overflow-hidden p-8 shadow-glow">
          <div className="absolute inset-x-0 top-0 h-1 bg-orbit-gradient" />
          <span className="absolute right-6 top-6 rounded-pill bg-orbit-violet/15 px-2.5 py-1 text-[11px] font-mono text-orbit-violet">
            Most popular
          </span>
          <h3 className="font-display text-lg font-medium">{PLANS.PRO.name}</h3>
          <p className="mt-1 text-sm text-ink-muted">For operators ready to scale.</p>
          <p className="mt-6 font-display text-4xl font-semibold">
            {PLANS.PRO.priceLabel}
            <span className="text-base font-normal text-ink-faint">/{PLANS.PRO.interval}</span>
          </p>
          <Link href="/signup?plan=pro" className="btn-primary mt-6 w-full">
            Upgrade to AI Pro
          </Link>
          <ul className="mt-7 space-y-3">
            {PLANS.PRO.features.map((f) => (
              <FeatureLine key={f} label={f} highlight />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeatureLine({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${highlight ? "text-orbit-cyan" : "text-ink-faint"}`} />
      <span className="text-ink-muted">{label}</span>
    </li>
  );
}

const testimonials = [
  { quote: "I imported my first product and had ads written before I finished my coffee.", name: "Freya H.", role: "AI Pro, home goods" },
  { quote: "The opportunity score alone paid for the subscription in the first week.", name: "Marcus D.", role: "AI Pro, fitness" },
  { quote: "Store builder gave me a brand that actually looked expensive. That's rare.", name: "Priya K.", role: "AI Pro, skincare" },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="Testimonials" title="Built for people actually running stores." />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="surface-card p-7">
            <p className="text-sm leading-relaxed text-ink">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-9 w-9 rounded-full bg-orbit-gradient" />
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-ink-faint">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  { q: "Is my first product really free?", a: "Yes — you can research, generate copy for, and publish one product at no cost, no card required." },
  { q: "What happens after my free product?", a: "You'll need AI Pro (€60/month) to import additional products. Everything you've already published keeps working." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from Billing at any time — you'll keep AI Pro access until the end of your current billing period." },
  { q: "Do I need my own supplier relationships?", a: "No. Orbital surfaces suppliers as part of product research, and you can add your own at any time." },
  { q: "Which AI models power Orbital?", a: "Orbital uses a provider-agnostic AI layer so the underlying model can be upgraded without changing how you work." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeading eyebrow="FAQ" title="Questions, answered." />
      <div className="mt-10 divide-y divide-border border-t border-border">
        {faqs.map((f, i) => (
          <div key={f.q} className="py-5">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="font-display text-sm font-medium sm:text-base">{f.q}</span>
              <span className="ml-4 flex-shrink-0 text-ink-faint">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="surface-card relative overflow-hidden px-8 py-16 text-center sm:px-16">
        <div className="absolute inset-0 bg-orbit-radial" />
        <div className="relative">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Your AI store is one product away.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-muted">
            Start free, publish your first product today, and see what Orbital can do.
          </p>
          <Link href="/signup" className="btn-primary mt-8 px-8 py-3 text-base">
            Start For Free
          </Link>
        </div>
      </div>
    </section>
  );
}
