import { DollarSign, ShoppingBag, Package, Percent, TrendingUp, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { OrbitScore } from "@/components/ui/orbit-score";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

// Products and AI-task count are real queries. Revenue/orders/conversion
// stay as illustrative figures until real Order rows exist for the store —
// see components/dashboard/revenue-chart.tsx for where to swap in
// db.order.aggregate(...) once checkout/orders are implemented.
export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [productCount, aiTaskCount] = user
    ? await Promise.all([
        db.importedProduct.count({ where: { userId: user.id } }),
        db.aIRequest.count({ where: { userId: user.id } }),
      ])
    : [0, 0];

  const topProducts = await (user
    ? db.importedProduct.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, title: true, priceCents: true },
      })
    : Promise.resolve([]));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Here's how your store is doing today.</p>
        </div>
        <Link href="/products/find" className="btn-primary">
          <Sparkles className="h-4 w-4" /> Find Products
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Revenue" value="€3,010" delta="+18.4%" icon={DollarSign} />
        <MetricCard label="Orders" value="86" delta="+9.2%" icon={ShoppingBag} />
        <MetricCard label="Products" value={String(productCount)} icon={Package} />
        <MetricCard label="Conversion" value="3.4%" delta="+0.6pt" icon={Percent} />
        <MetricCard label="Est. Profit" value="€1,760" delta="+22.1%" icon={TrendingUp} />
        <MetricCard label="AI Tasks" value={String(aiTaskCount)} icon={Sparkles} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="surface-card p-6">
          <h3 className="font-display text-sm font-medium">Your products</h3>
          <div className="mt-5 space-y-4">
            {topProducts.length === 0 && (
              <p className="text-sm text-ink-faint">
                No products yet —{" "}
                <Link href="/products/find" className="text-orbit-cyan hover:underline">
                  find your first one
                </Link>
                .
              </p>
            )}
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{p.title}</p>
                  <p className="data-figure text-xs text-ink-faint">€{(p.priceCents / 100).toFixed(2)}</p>
                </div>
                <OrbitScore score={78} size={36} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
