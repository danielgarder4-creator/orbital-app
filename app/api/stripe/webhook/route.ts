import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeClient, isBillingConfigured } from "@/lib/stripe/client";
import { db } from "@/lib/db/client";
import type Stripe from "stripe";

// ──────────────────────────────────────────────────────────────
// POST /api/stripe/webhook
// Single source of truth for subscription state. Verifies the
// Stripe signature with STRIPE_WEBHOOK_SECRET, then updates the
// Subscription + Payment rows so the rest of the app (billing
// page, plan-gating, admin MRR) reads from the database only —
// never calls Stripe directly on the request path.
//
// Configure this URL in the Stripe Dashboard:
//   {APP_URL}/api/stripe/webhook
// Events to enable:
//   checkout.session.completed
//   customer.subscription.updated
//   customer.subscription.deleted
//   invoice.payment_succeeded
//   invoice.payment_failed
// ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  if (!isBillingConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 501 });
  }

  const stripe = getStripeClient();
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe:webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId || !session.subscription) break;

        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await db.subscription.update({
          where: { userId },
          data: {
            plan: "PRO",
            status: "ACTIVE",
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await db.subscription.updateMany({
          where: { userId },
          data: {
            status: mapStripeStatus(sub.status),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            plan: sub.status === "active" || sub.status === "trialing" ? "PRO" : "FREE",
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await db.subscription.updateMany({
          where: { userId },
          data: { plan: "FREE", status: "CANCELED", cancelAtPeriodEnd: false },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.subscription_details?.metadata?.userId ?? invoice.metadata?.userId;
        if (!userId) break;

        await db.payment.create({
          data: {
            userId,
            stripeInvoiceId: invoice.id,
            amountCents: invoice.amount_paid,
            currency: invoice.currency,
            status: "SUCCEEDED",
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.subscription_details?.metadata?.userId ?? invoice.metadata?.userId;
        if (!userId) break;

        await db.payment.create({
          data: {
            userId,
            stripeInvoiceId: invoice.id,
            amountCents: invoice.amount_due,
            currency: invoice.currency,
            status: "FAILED",
          },
        });
        await db.subscription.updateMany({ where: { userId }, data: { status: "PAST_DUE" } });
        break;
      }

      default:
        // Unhandled event types are safely ignored.
        break;
    }
  } catch (err) {
    console.error(`[stripe:webhook] failed to process ${event.type}`, err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    case "incomplete":
    case "incomplete_expired":
      return "INCOMPLETE";
    default:
      return "NONE";
  }
}
