import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db/client";

// ──────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates the user + an initial FREE Subscription row (status
// NONE, freeProductUsed: false). Passwords are hashed with bcrypt
// before ever touching the database — never stored in plaintext.
// ──────────────────────────────────────────────────────────────

const bodySchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(req: Request) {
  const raw = req.headers.get("content-type")?.includes("application/json")
    ? await req.json()
    : Object.fromEntries((await req.formData()).entries());

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      subscription: { create: { plan: "FREE", status: "NONE", freeProductUsed: false } },
    },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
