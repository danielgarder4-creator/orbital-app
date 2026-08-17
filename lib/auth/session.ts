import { auth } from "./config";
import { db } from "@/lib/db/client";

// ──────────────────────────────────────────────────────────────
// Server-side session helpers used across API routes and server
// components. Keeps every route from re-implementing session
// lookups + plan checks.
// ──────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return db.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true, profile: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

/** Can this user import another product right now? */
export function canImportProduct(subscription: { plan: string; freeProductUsed: boolean } | null) {
  if (!subscription) return true; // first product is free, no subscription row yet
  if (subscription.plan === "PRO") return true;
  return !subscription.freeProductUsed;
}
