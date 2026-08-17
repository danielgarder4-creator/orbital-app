import { NextResponse } from "next/server";
import { getCurrentUser, canImportProduct } from "@/lib/auth/session";

// ──────────────────────────────────────────────────────────────
// GET /api/billing/status
// Single source of truth the UI polls to know:
//   - can this user import another product right now?
//   - have they used their free product?
//   - what plan are they on?
// Used by: product finder "Add to Store" button, billing page,
// the free-product banner in the dashboard.
// ──────────────────────────────────────────────────────────────

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const subscription = user.subscription;

  return NextResponse.json({
    plan: subscription?.plan ?? "FREE",
    status: subscription?.status ?? "NONE",
    freeProductUsed: subscription?.freeProductUsed ?? false,
    canImportProduct: canImportProduct(subscription),
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
  });
}
