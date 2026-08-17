import {
  Sparkles, Search, Store, Megaphone, ImageIcon, TrendingUp,
  Wand2, Tags, Truck, LineChart, LayoutTemplate, PenTool,
} from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Tell the AI what you're looking for",
    body: "Describe your niche or budget in plain language — Orbital searches thousands of suppliers for real opportunities.",
    icon: Search,
  },
  {
    n: "02",
    title: "Review AI-scored opportunities",
    body: "Every product gets an Opportunity Score out of 100, with margin, demand, and competition already worked out.",
    icon: TrendingUp,
  },
  {
    n: "03",
    title: "Generate everything, then publish",
    body: "Titles, descriptions, images, ads, and SEO — generated in one click. Edit anything, then publish to your store.",
    icon: Wand2,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="How it works" title="From idea to launch-ready store." />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="surface-card p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-orbit-cyan">{s.n}</span>
              <s.icon className="h-5 w-5 text-ink-faint" strokeWidth={1.5} />
            </div>
            <h3 className="mt-5 font-display text-lg font-medium">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Search, title: "AI Product Research", body: "Natural-language product discovery scored on demand, trend, margin, and competition." },
  { icon: PenTool, title: "AI Copywriting", body: "Titles, descriptions, bullet points, and SEO metadata generated in your brand voice." },
  { icon: ImageIcon, title: "AI Creative Studio", body: "Turn raw product photos into studio, lifestyle, and ad-ready imagery." },
  { icon: Megaphone, title: "AI Ad Generator", body: "Facebook, Instagram, TikTok, and Google ad copy — hooks, scripts, and CTAs included." },
  { icon: Store, title: "AI Store Builder", body: "Describe your brand and get a complete storefront: copy, colors, pages, and collections." },
  { icon: LineChart, title: "Product Analytics", body: "Track views, conversion, and profit per product without leaving the dashboard." },
  { icon: Tags, title: "Pricing & Margin Tools", body: "AI-suggested pricing that protects your margin while staying competitive." },
  { icon: Truck, title: "Supplier Intelligence", body: "Supplier reliability and shipping estimates surfaced before you commit inventory." },
  { icon: LayoutTemplate, title: "Automated Optimization", body: "Orbital flags underperforming products and suggests fixes automatically." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Features"
        title="An AI employee for every part of the business."
        body="Everything a small operations team would do — research, copy, creative, ads, and optimization — running continuously in the background."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="surface-card group p-6 transition-colors hover:border-border-hover">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised text-orbit-cyan transition-colors group-hover:bg-orbit-violet/10 group-hover:text-orbit-violet">
              <f.icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 font-display text-base font-medium">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  center = true,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="label-eyebrow">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base text-ink-muted">{body}</p>}
    </div>
  );
}
