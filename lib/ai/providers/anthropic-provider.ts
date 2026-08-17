import Anthropic from "@anthropic-ai/sdk";
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
// ANTHROPIC PROVIDER
// Real implementation. Every method sends a tightly-scoped prompt
// and requests strict JSON back, then validates + parses it.
// Swap in a different provider by implementing the same
// AIProvider interface — nothing outside lib/ai/ needs to change.
// ──────────────────────────────────────────────────────────────

const MODEL = "claude-sonnet-4-6";

function extractJSON<T>(text: string): T {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");
  return JSON.parse(cleaned) as T;
}

export class AnthropicAIProvider implements AIProvider {
  readonly name = "anthropic";
  readonly isDemo = false;
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  private async json<T>(system: string, prompt: string): Promise<T> {
    const res = await this.client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: `${system}\nRespond ONLY with valid JSON. No preamble, no markdown fences, no commentary.`,
      messages: [{ role: "user", content: prompt }],
    });
    const block = res.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") throw new Error("AI provider returned no text content");
    return extractJSON<T>(block.text);
  }

  async generateProductTitle({ rawTitle, niche }: { rawTitle: string; niche?: string }) {
    const { title } = await this.json<{ title: string }>(
      "You write concise, high-converting ecommerce product titles.",
      `Rewrite this product title to be more compelling for a dropshipping store${niche ? ` in the ${niche} niche` : ""}. Keep it under 70 characters. Raw title: "${rawTitle}". Return {"title": "..."}`
    );
    return title;
  }

  async generateProductDescription(input: { title: string; features?: string[]; niche?: string }): Promise<GeneratedProductCopy> {
    return this.json<GeneratedProductCopy>(
      "You write premium ecommerce product copy that converts without being hypey.",
      `Write full product copy for "${input.title}"${input.niche ? ` (niche: ${input.niche})` : ""}. ${
        input.features?.length ? `Key features: ${input.features.join(", ")}.` : ""
      } Return JSON with keys: title, description (2-3 sentences), bulletPoints (string array, 4-6 items), seoTitle, seoDescription, tags (string array), suggestedCollection.`
    );
  }

  async analyzeProduct(input: { title: string; costCents: number; niche?: string }): Promise<ProductAnalysis> {
    return this.json<ProductAnalysis>(
      "You are a dropshipping product research analyst. Be specific and realistic, not hypey.",
      `Analyze "${input.title}" as a dropshipping product with a cost of €${(input.costCents / 100).toFixed(2)}${
        input.niche ? ` in the ${input.niche} niche` : ""
      }. Return JSON with keys: summary, strengths (string array), risks (string array), suggestedPriceCents (number), estimatedMarginPct (number), competitionSummary.`
    );
  }

  async findProducts({ query, maxResults = 8 }: { query: string; maxResults?: number }): Promise<DiscoveredProductDTO[]> {
    const { products } = await this.json<{ products: DiscoveredProductDTO[] }>(
      "You are a dropshipping product research engine. Generate realistic, specific product opportunities — not generic placeholders. Every score must be an integer 0-100 and internally consistent with the stated demand/trend/competition.",
      `Find ${maxResults} dropshipping product opportunities for: "${query}". Return JSON: {"products": [{"id": "...", "title": "...", "imageUrl": "...", "supplier": "...", "costCents": number, "suggestedPriceCents": number, "estimatedProfitCents": number, "estimatedMarginPct": number, "competition": "LOW"|"MEDIUM"|"HIGH", "demandScore": number, "trendScore": number, "opportunityScore": number, "aiRecommendation": "..."}]}`
    );
    return products;
  }

  async generateAdCopy(input: AdCopyRequest): Promise<AdCopyResult> {
    return this.json<AdCopyResult>(
      "You are a senior direct-response media buyer writing ad copy for ecommerce.",
      `Write ${input.platform} ad copy for "${input.productTitle}". Product description: ${input.productDescription}. ${
        input.tone ? `Tone: ${input.tone}.` : ""
      } Return JSON with keys: headlines (string array, 3), primaryText, hooks (string array, 3), ctas (string array, 3)${
        input.platform === "tiktok" || input.platform === "instagram"
          ? `, videoScript: {"hook": "...", "problem": "...", "product": "...", "benefits": ["...", "..."], "cta": "..."}`
          : ""
      }.`
    );
  }

  async generateStore(input: StoreBrief): Promise<GeneratedStore> {
    return this.json<GeneratedStore>(
      "You are a brand strategist and copywriter building a complete store identity.",
      `Design a store based on this brief: "${input.description}". Return JSON with keys: storeName, tagline, logoConcept (a written description, not an image), primaryColor (hex), accentColor (hex), homepage: {headline, subheadline}, aboutPage (short paragraph), faq (array of {question, answer}, 3 items), collections (string array, 4 items).`
    );
  }

  async generateSEO(input: { title: string; description: string }) {
    return this.json<{ title: string; description: string }>(
      "You write SEO metadata that is accurate and click-worthy.",
      `Write an SEO title (<60 chars) and meta description (<155 chars) for a product page. Title: "${input.title}". Description: "${input.description}". Return {"title": "...", "description": "..."}`
    );
  }

  async generateImagePrompt(input: ImagePromptRequest) {
    const { prompt } = await this.json<{ prompt: string }>(
      "You write precise prompts for a commercial product photography image model.",
      `Write an image-generation prompt for a ${input.style} photo of: ${input.productDescription}. ${
        input.background ? `Background: ${input.background}.` : ""
      } ${input.lighting ? `Lighting: ${input.lighting}.` : ""} Return {"prompt": "..."}`
    );
    return prompt;
  }

  async suggestPricing(input: { costCents: number; niche?: string; competition?: "LOW" | "MEDIUM" | "HIGH" }) {
    return this.json<{ priceCents: number; marginPct: number; rationale: string }>(
      "You are a pricing strategist for ecommerce products.",
      `Suggest a retail price for a product costing €${(input.costCents / 100).toFixed(2)}${
        input.niche ? ` in ${input.niche}` : ""
      } with ${input.competition ?? "MEDIUM"} competition. Return {"priceCents": number, "marginPct": number, "rationale": "..."}`
    );
  }
}
