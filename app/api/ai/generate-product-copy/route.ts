import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai/service";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

const bodySchema = z.object({
  discoveredProductId: z.string().optional(),
  rawTitle: z.string().min(2).max(200),
  niche: z.string().optional(),
});

// ──────────────────────────────────────────────────────────────
// POST /api/ai/generate-product-copy
// Generates an improved title + full description/bullets/SEO/tags
// for a product, in one call. Used by the importer (step 9) right
// after a user picks a DiscoveredProduct to bring into their store.
// ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const start = Date.now();
  try {
    const title = await AIService.generateProductTitle({
      rawTitle: parsed.data.rawTitle,
      niche: parsed.data.niche,
    });
    const copy = await AIService.generateProductDescription({
      title,
      niche: parsed.data.niche,
    });

    await db.aIRequest.create({
      data: {
        userId: user.id,
        feature: "PRODUCT_DESCRIPTION",
        prompt: parsed.data.rawTitle,
        response: copy.description,
        succeeded: true,
        latencyMs: Date.now() - start,
      },
    });

    return NextResponse.json({ copy, demo: AIService.isDemo });
  } catch (err) {
    console.error("[api/ai/generate-product-copy]", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
