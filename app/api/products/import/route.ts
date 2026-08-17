import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, canImportProduct } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

const bodySchema = z.object({
  discoveredProductId: z.string(),
  title: z.string().min(2).max(200),
  description: z.string().min(2),
  bulletPoints: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
  tags: z.array(z.string()),
  collection: z.string(),
  costCents: z.number().int().nonnegative(),
  priceCents: z.number().int().nonnegative(),
});

// ──────────────────────────────────────────────────────────────
// POST /api/products/import
// THE enforcement point for the free-first-product rule. Runs
// canImportProduct() against the user's current subscription; if
// they're on FREE and have already used their free import, the
// request is rejected with 402 rather than silently succeeding.
// On success: creates the ImportedProduct AND, for FREE users,
// flips Subscription.freeProductUsed to true in the same request —
// there is no path to import a second free product.
// ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  if (!canImportProduct(user.subscription)) {
    return NextResponse.json(
      { error: "You've used your free product. Upgrade to AI Pro to continue importing products.", requiresUpgrade: true },
      { status: 402 }
    );
  }

  const { discoveredProductId, ...productData } = parsed.data;

  const product = await db.$transaction(async (tx) => {
    const created = await tx.importedProduct.create({
      data: { ...productData, userId: user.id, discoveredProductId, status: "DRAFT" },
    });

    // Mark the free product as used the moment a FREE-plan user imports
    // their first product — not on publish, not retroactively.
    if (user.subscription?.plan !== "PRO") {
      await tx.subscription.upsert({
        where: { userId: user.id },
        update: { freeProductUsed: true },
        create: { userId: user.id, plan: "FREE", status: "NONE", freeProductUsed: true },
      });
    }

    return created;
  });

  return NextResponse.json({ product }, { status: 201 });
}
