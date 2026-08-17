import type {
  AIProvider,
  AdCopyRequest,
  AdCopyResult,
  DiscoveredProductDTO,
  GeneratedProductCopy,
  GeneratedStore,
  ImagePromptRequest,
  ProductAnalysis,
  StoreBrief,
} from "../types";

// ──────────────────────────────────────────────────────────────
// MOCK PROVIDER
// Used automatically whenever no AI_PROVIDER / API key is
// configured (see lib/ai/service.ts). Produces realistic,
// clearly-labeled demo content so every screen in the product is
// fully explorable with zero external dependencies. Nothing here
// should ever be presented to the end user as a real AI result —
// callers are responsible for the "Demo mode" badge (see
// components/ui/demo-badge.tsx).
// ──────────────────────────────────────────────────────────────

function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return () => {
    h = (Math.imul(h ^ (h >>> 15), 1 | h) + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 7), 61 | h);
    t = (t + Math.imul(t ^ (t >>> 14), 2246822519)) ^ t;
    return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
  };
}

const SUPPLIERS = ["NovaGoods CN", "Meridian Wholesale", "Atlas Direct", "Pace Supply Co.", "Fenwick Trading"];
const NICHE_IMAGES: Record<string, string> = {
  fitness: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
  skincare: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
  home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  default: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600",
};

function pickImage(query: string) {
  const q = query.toLowerCase();
  if (q.includes("gym") || q.includes("fitness")) return NICHE_IMAGES.fitness;
  if (q.includes("skin") || q.includes("beauty")) return NICHE_IMAGES.skincare;
  if (q.includes("home") || q.includes("kitchen")) return NICHE_IMAGES.home;
  if (q.includes("tech") || q.includes("gadget")) return NICHE_IMAGES.tech;
  return NICHE_IMAGES.default;
}

const PRODUCT_NOUNS = [
  "Resistance Band Set", "Compact Massage Gun", "Ceramic Pour-Over Kettle", "Magnetic Cable Organizer",
  "LED Vanity Mirror", "Foldable Laptop Stand", "Silicone Baking Mat", "Adjustable Yoga Mat Strap",
  "Mini Humidifier", "Wireless Ring Light",
];

export class MockAIProvider implements AIProvider {
  readonly name = "mock";
  readonly isDemo = true;

  private async latency() {
    // Simulate realistic model latency so loading states feel honest in demos.
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
  }

  async generateProductTitle({ rawTitle, niche }: { rawTitle: string; niche?: string }) {
    await this.latency();
    const clean = rawTitle.replace(/\b\w/g, (c) => c.toUpperCase()).trim();
    const suffix = niche ? ` — ${niche} Essential` : " — Premium Edition";
    return `${clean}${suffix}`;
  }

  async generateProductDescription({ title, features = [], niche }: { title: string; features?: string[]; niche?: string }): Promise<GeneratedProductCopy> {
    await this.latency();
    const rnd = seededRandom(title);
    const bullets = (features.length ? features : [
      "Premium materials built to last",
      "Designed for everyday use",
      "Lightweight and easy to carry",
      "Backed by our 30-day guarantee",
    ]).slice(0, 5);

    return {
      title,
      description:
        `Meet ${title} — built for people who expect more from ${niche ?? "the products they buy"}. ` +
        `Every detail is engineered for comfort, durability, and a look that feels genuinely premium. ` +
        `It's the kind of product customers mention in reviews without being asked.`,
      bulletPoints: bullets,
      seoTitle: `${title} | Fast Shipping`,
      seoDescription: `Shop ${title} — premium quality, fast shipping, and a 30-day guarantee. Loved by customers in ${niche ?? "every category"}.`,
      tags: [niche ?? "trending", "bestseller", "free-shipping"].filter(Boolean),
      suggestedCollection: niche ? `${niche} Essentials` : "New Arrivals",
    };
  }

  async analyzeProduct({ title, costCents, niche }: { title: string; costCents: number; niche?: string }): Promise<ProductAnalysis> {
    await this.latency();
    const rnd = seededRandom(title);
    const margin = 55 + Math.floor(rnd() * 25);
    const price = Math.round((costCents * (100 / (100 - margin))) / 10) * 10;
    return {
      summary: `${title} shows strong signals for ${niche ?? "general"} audiences: rising search interest, moderate competition, and healthy margin headroom at this cost basis.`,
      strengths: [
        "Search interest trending up over the last 90 days",
        "Below-average number of established sellers",
        "Lightweight — keeps shipping cost and returns low",
      ],
      risks: [
        "Seasonal demand — plan inventory around peak months",
        "Price-sensitive audience; avoid over-discounting early",
      ],
      suggestedPriceCents: price,
      estimatedMarginPct: margin,
      competitionSummary: "Medium — a handful of established sellers, but no dominant brand yet.",
    };
  }

  async findProducts({ query, maxResults = 8 }: { query: string; maxResults?: number }): Promise<DiscoveredProductDTO[]> {
    await this.latency();
    const rnd = seededRandom(query);
    const image = pickImage(query);
    const results: DiscoveredProductDTO[] = [];

    for (let i = 0; i < maxResults; i++) {
      const noun = PRODUCT_NOUNS[Math.floor(rnd() * PRODUCT_NOUNS.length)];
      const costCents = Math.round((800 + rnd() * 3500) / 10) * 10;
      const margin = 50 + Math.floor(rnd() * 30);
      const priceCents = Math.round((costCents * (100 / (100 - margin))) / 10) * 10;
      const demandScore = Math.floor(50 + rnd() * 50);
      const trendScore = Math.floor(40 + rnd() * 60);
      const competitionRoll = rnd();
      const competition: DiscoveredProductDTO["competition"] =
        competitionRoll < 0.34 ? "LOW" : competitionRoll < 0.7 ? "MEDIUM" : "HIGH";
      const competitionPenalty = competition === "HIGH" ? 15 : competition === "MEDIUM" ? 6 : 0;
      const opportunityScore = Math.max(
        10,
        Math.min(99, Math.round(demandScore * 0.4 + trendScore * 0.4 + (margin - competitionPenalty) * 0.4 - 10))
      );

      results.push({
        id: `disc_${query.slice(0, 6)}_${i}_${Math.floor(rnd() * 1e6)}`,
        title: `${noun}${i === 0 ? "" : ` ${["Pro", "Plus", "Mini", "2.0", "Max"][i % 5]}`}`,
        imageUrl: image,
        supplier: SUPPLIERS[Math.floor(rnd() * SUPPLIERS.length)],
        costCents,
        suggestedPriceCents: priceCents,
        estimatedProfitCents: priceCents - costCents,
        estimatedMarginPct: margin,
        competition,
        demandScore,
        trendScore,
        opportunityScore,
        aiRecommendation:
          opportunityScore >= 80
            ? "Strong opportunity — low competition with rising demand. Good candidate to launch this week."
            : opportunityScore >= 60
            ? "Solid opportunity — validate with a small ad budget before scaling inventory."
            : "Worth monitoring — demand is present but competition or margin is a headwind right now.",
      });
    }

    return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  async generateAdCopy({ productTitle, productDescription, platform }: AdCopyRequest): Promise<AdCopyResult> {
    await this.latency();
    const base: AdCopyResult = {
      headlines: [
        `${productTitle}: the upgrade you didn't know you needed`,
        `Why everyone's switching to ${productTitle}`,
        `${productTitle} — sold out twice this month`,
      ],
      primaryText: `${productDescription.slice(0, 140)}${productDescription.length > 140 ? "…" : ""} Free shipping today only.`,
      hooks: [
        "POV: you finally found the one that actually works",
        "I wasn't going to post about this but…",
        "The internet is obsessed with this right now",
      ],
      ctas: ["Shop Now", "Get Yours Today", "Claim Your Discount"],
    };

    if (platform === "tiktok" || platform === "instagram") {
      base.videoScript = {
        hook: "Stop scrolling if you've been dealing with this...",
        problem: "You've tried everything and nothing quite fits into your routine.",
        product: `That's exactly why we made ${productTitle}.`,
        benefits: ["Takes seconds to use", "Fits any routine", "Customers say it's a game-changer"],
        cta: "Link in bio — while stock lasts",
      };
    }

    return base;
  }

  async generateStore({ description }: StoreBrief): Promise<GeneratedStore> {
    await this.latency();
    const rnd = seededRandom(description);
    const nicheWord = description.split(" ").find((w) => w.length > 4) ?? "Studio";
    const names = ["Lumen", "Verdant", "Nectra", "Aurelle", "Solace", "Thistle"];
    const storeName = `${names[Math.floor(rnd() * names.length)]} ${nicheWord.charAt(0).toUpperCase() + nicheWord.slice(1)}`;

    return {
      storeName,
      tagline: `${storeName} — made for how you actually live.`,
      logoConcept: `A minimal wordmark in ${storeName}, set in a rounded geometric sans, paired with a single abstract mark derived from the brief.`,
      primaryColor: "#111117",
      accentColor: "#7C6CFF",
      homepage: {
        headline: `Everything ${description.replace(/^a |^an /i, "")}, in one place.`,
        subheadline: "Thoughtfully sourced. Fast shipping. Loved by customers who expect more.",
      },
      aboutPage: `${storeName} started with a simple idea: ${description} deserves better options than what's already out there. We obsess over quality, ship fast, and stand behind everything we sell.`,
      faq: [
        { question: "How fast is shipping?", answer: "Most orders arrive within 5–8 business days." },
        { question: "What's your return policy?", answer: "30-day returns, no questions asked." },
        { question: "Do you ship internationally?", answer: "Yes — we ship to most countries worldwide." },
      ],
      collections: ["New Arrivals", "Best Sellers", "Under €30", "Staff Picks"],
    };
  }

  async generateSEO({ title, description }: { title: string; description: string }) {
    await this.latency();
    return {
      title: `${title} | Fast, Free Shipping`,
      description: description.slice(0, 150),
    };
  }

  async generateImagePrompt({ productDescription, style, background, lighting }: ImagePromptRequest) {
    await this.latency();
    return (
      `${style} product photograph of ${productDescription}, ` +
      `${background ? `set against ${background}` : "clean neutral background"}, ` +
      `${lighting ? `${lighting} lighting` : "soft studio lighting"}, high detail, commercial photography`
    );
  }

  async suggestPricing({ costCents, competition = "MEDIUM" }: { costCents: number; niche?: string; competition?: "LOW" | "MEDIUM" | "HIGH" }) {
    await this.latency();
    const targetMargin = competition === "LOW" ? 68 : competition === "MEDIUM" ? 58 : 48;
    const priceCents = Math.round((costCents * (100 / (100 - targetMargin))) / 10) * 10;
    return {
      priceCents,
      marginPct: targetMargin,
      rationale: `Priced for a ${targetMargin}% margin given ${competition.toLowerCase()} competition — leaves room for ad spend while staying credible for this category.`,
    };
  }
}
