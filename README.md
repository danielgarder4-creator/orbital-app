# Orbital

Your AI-powered dropshipping business — find products, build your store,
generate marketing, and launch. This repo is a real Next.js application,
not a static mockup: it has working auth, a Postgres schema, Stripe
billing, and an AI layer that runs in demo mode until you add API keys.

## Quick start

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL at minimum
npm run db:push             # create tables from prisma/schema.prisma
npm run db:seed             # optional: demo user + sample data
npm run dev
```

Visit http://localhost:3000.

## Demo mode vs. live mode

Two subsystems are designed to run without any external credentials,
clearly labeled whenever they're doing so:

| System   | Demo mode (no keys)                          | Live mode                                  |
|----------|-----------------------------------------------|---------------------------------------------|
| AI       | `MockAIProvider` — realistic generated data   | Set `AI_PROVIDER=anthropic` + `ANTHROPIC_API_KEY` |
| Billing  | Upgrade button shows a "not configured" notice | Set `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID` |

Every AI response and billing action checks these at runtime — nothing
is hard-coded to *look* live when it isn't. See `.env.example` for the
full variable list.

## What's real vs. what's still a stub

**Fully wired (DB + API route + UI):**
auth (signup/login/session), free-product gating, product import +
AI title/description generation, product finder, AI store builder,
Stripe checkout + webhooks, billing status, admin metrics.

**UI built, backing data still static/demo:**
orders, analytics charts, suppliers, SEO scores, automations — these
render from fixture data since they depend on a live store with real
orders. Swapping in real queries is a matter of replacing the fixture
arrays with `db.order.findMany(...)` etc. against the existing schema.

## Folder map

- `app/(marketing)` — public landing page
- `app/(auth)` — signup / login / forgot password
- `app/(app)` — authenticated dashboard (sidebar shell in `layout.tsx`)
- `app/admin` — platform owner dashboard (role-gated)
- `app/api` — route handlers (auth, AI, Stripe)
- `lib/ai` — provider-agnostic AI service + mock/Anthropic implementations
- `lib/stripe` — Stripe client + plan config
- `lib/auth` — NextAuth config + session/plan helpers
- `prisma/schema.prisma` — full data model
