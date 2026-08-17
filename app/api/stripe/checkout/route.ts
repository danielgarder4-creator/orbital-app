import { NextResponse } from "next/server";
import { getStripeClient, isBillingConfigured } from "@/lib/stripe/client";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

// ──────────────────────────────────────────────────────────────
// POST /api/stripe/checkout
// Creates a Stripe Checkout Session for the €60/mo AI Pro plan and
// returns the redirect URL. Requires the user to be signed in.
// Payments settle to the platform owner's connected Stripe account
// via STRIPE_SECRET_KEY — never hard-coded.
// ──────────────────────────────────────────────────────────────

export async function POST() {
  if (!isBillingConfigured()) {
    return NextResponse.json(
      {
        error:
          "Billing isn't configured yet. Add STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, and STRIPE_PRO_PRICE_ID to enable real subscriptions.",
        demo: true,
      },
      { status: 501 }
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const stripe = getStripeClient();

  // Reuse an existing Stripe customer if one exists for this user.
  const subscription = await db.subscription.findUnique({ where: { userId: user.id } });

  const customerId =
    subscription?.stripeCustomerId ??
    (
      await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { userId: user.id },
      })
    ).id;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?checkout=canceled`,
    metadata: { userId: user.id },
    subscription_data: { metadata: { userId: user.id } },
  });

  // Persist the customer id right away so webhooks can match reliably
  // even if the user abandons checkout before completing it.
  await db.subscription.upsert({
    where: { userId: user.id },
    update: { stripeCustomerId: customerId },
    create: { userId: user.id, stripeCustomerId: customerId, plan: "FREE", status: "NONE" },
  });

  return NextResponse.json({ url: session.url });
}
