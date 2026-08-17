import type { AIProvider } from "./types";
import { MockAIProvider } from "./providers/mock-provider";

// ──────────────────────────────────────────────────────────────
// AIService — the ONLY entry point the rest of the app should use
// for AI features. It resolves to a real provider when credentials
// exist, and falls back to the mock provider otherwise so every
// screen keeps working in demo mode.
//
//   import { AIService } from "@/lib/ai/service";
//   const copy = await AIService.generateProductDescription({ title });
//
// Adding a new provider: implement AIProvider in
// lib/ai/providers/<name>-provider.ts, then add a case below.
// Nothing else in the codebase needs to change.
// ──────────────────────────────────────────────────────────────

let cached: AIProvider | null = null;

function resolveProvider(): AIProvider {
  if (cached) return cached;

  const providerName = process.env.AI_PROVIDER ?? "mock";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (providerName === "anthropic" && apiKey) {
    // Lazy import so the SDK + key are never touched in demo mode.
    const { AnthropicAIProvider } = require("./providers/anthropic-provider");
    cached = new AnthropicAIProvider(apiKey);
  } else {
    cached = new MockAIProvider();
  }

  return cached!;
}

export const AIService: AIProvider = new Proxy({} as AIProvider, {
  get(_target, prop) {
    const provider = resolveProvider();
    // @ts-expect-error - dynamic proxy dispatch
    return provider[prop];
  },
});

export function isAIDemoMode(): boolean {
  return resolveProvider().isDemo;
}
