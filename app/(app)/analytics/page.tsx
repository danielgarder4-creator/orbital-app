import { MetricCard } from "@/components/dashboard/metric-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { DollarSign, Percent, Users, ShoppingCart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Analytics</h1>
        <p className="mt-1 text-sm text-ink-muted">Performance across your store.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Avg. order value" value="€29.40" delta="+4.1%" icon={DollarSign} />
        <MetricCard label="Conversion rate" value="3.4%" delta="+0.6pt" icon={Percent} />
        <MetricCard label="Customer acq. cost" value="€6.80" delta="-2.3%" icon={Users} />
        <MetricCard label="Repeat purchase rate" value="11%" delta="+1.1pt" icon={ShoppingCart} />
      </div>

      <RevenueChart />
    </div>
  );
}
