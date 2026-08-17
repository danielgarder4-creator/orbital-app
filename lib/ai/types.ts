// ──────────────────────────────────────────────────────────────
// ORBITAL AI LAYER — shared types
// Every AI provider (mock, Anthropic, future providers) implements
// the same AIProvider interface, so the rest of the app never
// talks to a specific model — only to this contract.
// ──────────────────────────────────────────────────────────────

export interface DiscoveredProductDTO {
  id: string;
  title: string;
  imageUrl: string;
  supplier: string;
  costCents: number;
  suggestedPriceCents: number;
  estimatedProfitCents: number;
  estimatedMarginPct: number;
  competition: "LOW" | "MEDIUM" | "HIGH";
  demandScore: number;
  trendScore: number;
  opportunityScore: number;
  aiRecommendation: string;
}

export interface ProductAnalysis {
  summary: string;
  strengths: string[];
  risks: string[];
  suggestedPriceCents: number;
  estimatedMarginPct: number;
  competitionSummary: string;
}

export interface GeneratedProductCopy {
  title: string;
  description: string;
  bulletPoints: string[];
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  suggestedCollection: string;
}

export interface AdCopyRequest {
  productTitle: string;
  productDescription: string;
  platform: "facebook" | "instagram" | "tiktok" | "google";
  tone?: string;
}

export interface AdCopyResult {
  headlines: string[];
  primaryText: string;
  hooks: string[];
  ctas: string[];
  /** Only present for short-form video platforms (tiktok/instagram reels) */
  videoScript?: {
    hook: string;
    problem: string;
    product: string;
    benefits: string[];
    cta: string;
  };
}

export interface StoreBrief {
  description: string; // e.g. "a luxury skincare store targeting women aged 18-30"
}

export interface GeneratedStore {
  storeName: string;
  tagline: string;
  logoConcept: string;
  primaryColor: string;
  accentColor: string;
  homepage: { headline: string; subheadline: string };
  aboutPage: string;
  faq: { question: string; answer: string }[];
  collections: string[];
}

export interface ImagePromptRequest {
  productDescription: string;
  style: "studio" | "lifestyle" | "social" | "ad";
  background?: string;
  lighting?: string;
  aspectRatio?: "1:1" | "4:5" | "16:9" | "9:16";
}

/** Every provider must implement this surface. */
export interface AIProvider {
  readonly name: string;
  readonly isDemo: boolean;

  generateProductTitle(input: { rawTitle: string; niche?: string }): Promise<string>;

  generateProductDescription(input: {
    title: string;
    features?: string[];
    niche?: string;
  }): Promise<GeneratedProductCopy>;

  analyzeProduct(input: { title: string; costCents: number; niche?: string }): Promise<ProductAnalysis>;

  findProducts(input: { query: string; maxResults?: number }): Promise<DiscoveredProductDTO[]>;

  generateAdCopy(input: AdCopyRequest): Promise<AdCopyResult>;

  generateStore(input: StoreBrief): Promise<GeneratedStore>;

  generateSEO(input: { title: string; description: string }): Promise<{ title: string; description: string }>;

  generateImagePrompt(input: ImagePromptRequest): Promise<string>;

  suggestPricing(input: { costCents: number; niche?: string; competition?: "LOW" | "MEDIUM" | "HIGH" }): Promise<{
    priceCents: number;
    marginPct: number;
    rationale: string;
  }>;
}
