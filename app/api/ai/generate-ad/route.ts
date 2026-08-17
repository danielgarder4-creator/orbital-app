import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai/service";
import { z } from "zod";

const bodySchema = z.object({
  productTitle: z.string().min(2).max(120),
  productDescription: z.string().min(2).max(600),
  platform: z.enum(["facebook", "instagram", "tiktok", "google"]),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    const ad = await AIService.generateAdCopy(parsed.data);
    return NextResponse.json({ ad, demo: AIService.isDemo });
  } catch (err) {
    console.error("[api/ai/generate-ad]", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
