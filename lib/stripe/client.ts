import Stripe from "stripe";

// ──────────────────────────────────────────────────────────────
// STRIPE CLIENT
// Billing goes to the platform owner's connected Stripe account —
// credentials come only from environment variables, never from
// code. If STRIPE_SECRET_KEY is unset, `isBillingConfigured()`
// returns false and the app must not claim payments are live
// (see components/billing/plan-card.tsx for the demo-mode banner).
// ──────────────────────────────────────────────────────────────

export const PLANS = {
  FREE: {
    id: "FREE" as const,
    name: "Free",
    priceCents: 0,
    priceLabel: "€0",
    features: ["1 product import", "Basic AI tools", "Basic product research"],
  },
  PRO: {
    id: "PRO" as const,
    name: "AI Pro",
    priceCents: 6000,
    priceLabel: "€60",
    interval: "month",
    features: [
      "Unlimited product imports",
      "Full AI automation",
      "Advanced product research",
      "AI ad generator",
      "AI creative studio",
      "AI store builder",
      "Analytics & SEO tools",
      "Priority AI processing",
    ],
  },
} as const;

export function isBillingConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRO_PRICE_ID);
}

let stripeClient: Stripe | null = null;

/** Throws if called without credentials — callers must check isBillingConfigured() first. */
export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Billing is running in demo mode — see .env.example."
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    });
  }
  return stripeClient;
}
