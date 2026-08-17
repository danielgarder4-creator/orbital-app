import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai/service";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

const bodySchema = z.object({ description: z.string().min(5).max(400) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const start = Date.now();
  try {
    const store = await AIService.generateStore({ description: parsed.data.description });

    await db.aIRequest.create({
      data: {
        userId: user.id,
        feature: "STORE_BUILDER",
        prompt: parsed.data.description,
        succeeded: true,
        latencyMs: Date.now() - start,
      },
    });

    return NextResponse.json({ store, demo: AIService.isDemo });
  } catch (err) {
    console.error("[api/ai/generate-store]", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
