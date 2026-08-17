import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai/service";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

const bodySchema = z.object({
  query: z.string().min(3).max(300),
});

// ──────────────────────────────────────────────────────────────
// POST /api/ai/find-products
// Calls the AI layer, persists each result as a DiscoveredProduct
// row (so "Add to Store" in the importer can reference a real,
// stable ID rather than client-only state), and logs an AIRequest
// row for usage tracking. Requires a signed-in user.
// ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const start = Date.now();
  try {
    const results = await AIService.findProducts({ query: parsed.data.query, maxResults: 6 });

    // Persist so each product has a durable id the importer can reference.
    const saved = await Promise.all(
      results.map((p) =>
        db.discoveredProduct.create({
          data: {
            title: p.title,
            imageUrl: p.imageUrl,
            supplier: p.supplier,
            costCents: p.costCents,
            suggestedPriceCents: p.suggestedPriceCents,
            competition: p.competition,
            demandScore: p.demandScore,
            trendScore: p.trendScore,
            opportunityScore: p.opportunityScore,
            sourceQuery: parsed.data.query,
          },
        })
      )
    );

    await db.aIRequest.create({
      data: {
        userId: user.id,
        feature: "PRODUCT_RESEARCH",
        prompt: parsed.data.query,
        succeeded: true,
        latencyMs: Date.now() - start,
      },
    });

    // Merge the persisted DB id back onto the AI response shape the UI expects.
    const products = results.map((p, i) => ({ ...p, id: saved[i].id }));

    return NextResponse.json({ products, demo: AIService.isDemo });
  } catch (err) {
    console.error("[api/ai/find-products]", err);
    await db.aIRequest.create({
      data: {
        userId: user.id,
        feature: "PRODUCT_RESEARCH",
        prompt: parsed.data.query,
        succeeded: false,
        latencyMs: Date.now() - start,
      },
    });
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
