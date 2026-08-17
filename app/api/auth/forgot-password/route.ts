import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db/client";

// ──────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// Always returns 200 (never reveals whether an email exists).
// Creates a VerificationToken row. If RESEND_API_KEY is set, sends
// a real email; otherwise logs the reset link to the server console
// so the flow is testable without an email provider configured.
// ──────────────────────────────────────────────────────────────

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const raw = req.headers.get("content-type")?.includes("application/json")
    ? await req.json()
    : Object.fromEntries((await req.formData()).entries());

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    const token = randomBytes(32).toString("hex");
    await db.verificationToken.create({
      data: { identifier: user.email, token, expires: new Date(Date.now() + 1000 * 60 * 30) },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      // Live mode: send via Resend.
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Orbital <hello@orbital.app>",
        to: user.email,
        subject: "Reset your Orbital password",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
      });
    } else {
      // Demo mode: no email provider configured — log instead of sending.
      console.log(`[demo email] Password reset link for ${user.email}: ${resetUrl}`);
    }
  }

  return NextResponse.json({ ok: true });
}
