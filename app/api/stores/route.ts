import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

const bodySchema = z.object({
  storeName: z.string().min(1).max(80),
  primaryColor: z.string(),
  accentColor: z.string(),
  homepage: z.object({ headline: z.string(), subheadline: z.string() }),
  aboutPage: z.string(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  collections: z.array(z.string()),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ──────────────────────────────────────────────────────────────
// POST /api/stores
// Persists an AI-generated store as a real Store row. Slug is
// de-duplicated by appending a short suffix if it's already taken —
// two users naming their store "Lumen Skincare" don't collide.
// ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const base = slugify(parsed.data.storeName) || "store";
  let slug = base;
  let suffix = 0;
  while (await db.store.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  const store = await db.store.create({
    data: {
      userId: user.id,
      name: parsed.data.storeName,
      slug,
      primaryColor: parsed.data.primaryColor,
      accentColor: parsed.data.accentColor,
      homepageCopy: {
        homepage: parsed.data.homepage,
        aboutPage: parsed.data.aboutPage,
        faq: parsed.data.faq,
        collections: parsed.data.collections,
      },
    },
  });

  return NextResponse.json({ store }, { status: 201 });
}
