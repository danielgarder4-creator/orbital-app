import { Users, CreditCard, TrendingUp, UserPlus, UserMinus, Package } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { redirect } from "next/navigation";

// Middleware (see /middleware.ts) already blocks non-admins from ever
// reaching this route. requireAdmin() is a second, defense-in-depth
// check at the data layer — if it throws, we redirect rather than
// leak a stack trace.
export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  const [totalUsers, activeSubscriptions, newUsersThisMonth, canceledThisMonth, productImports, aiRequests, proSubscribers] =
    await Promise.all([
      db.user.count(),
      db.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } }),
      db.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
      db.subscription.count({ where: { status: "CANCELED", updatedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
      db.importedProduct.count(),
      db.aIRequest.count(),
      db.subscription.count({ where: { plan: "PRO" } }),
    ]);

  const mrrCents = proSubscribers * 6000; // PLANS.PRO.priceCents — kept literal to avoid a client/server import edge case

  const users = await db.user.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: { email: true, createdAt: true, subscription: { select: { plan: true, status: true } } },
  });

  return (
    <div className="min-h-screen bg-void px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <span className="label-eyebrow">Admin</span>
          <h1 className="mt-2 font-display text-2xl font-semibold">Platform overview</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <MetricCard label="Total users" value={String(totalUsers)} icon={Users} />
          <MetricCard label="Active subs" value={String(activeSubscriptions)} icon={CreditCard} />
          <MetricCard label="MRR" value={`€${(mrrCents / 100).toLocaleString()}`} icon={TrendingUp} />
          <MetricCard label="New users (30d)" value={String(newUsersThisMonth)} icon={UserPlus} />
          <MetricCard label="Canceled (30d)" value={String(canceledThisMonth)} positive={false} icon={UserMinus} />
          <MetricCard label="Product imports" value={String(productImports)} icon={Package} />
        </div>

        <RevenueChart />

        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-display text-sm font-medium">Users</h3>
            <span className="text-xs text-ink-faint">{aiRequests} total AI requests across the platform</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-ink-faint">
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.email}>
                  <td className="px-6 py-3.5">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`rounded-pill px-2.5 py-1 text-xs font-mono ${
                        u.subscription?.plan === "PRO" ? "bg-orbit-violet/10 text-orbit-violet" : "bg-surface-raised text-ink-muted"
                      }`}
                    >
                      {u.subscription?.plan ?? "FREE"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-ink-muted">{u.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded-pill bg-surface-raised px-2.5 py-1 text-xs font-mono text-ink-muted">
                      {u.subscription?.status ?? "NONE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
