import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

export default async function MyProductsPage() {
  const user = await getCurrentUser();
  const products = user
    ? await db.importedProduct.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">My Products</h1>
          <p className="mt-1 text-sm text-ink-muted">Products you've imported and published.</p>
        </div>
        <Link href="/products/find" className="btn-primary">
          <Sparkles className="h-4 w-4" /> Find More Products
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="surface-card flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm text-ink-muted">No products yet.</p>
          <Link href="/products/find" className="btn-primary">
            Find Your First Product
          </Link>
        </div>
      ) : (
        <div className="surface-card divide-y divide-border">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="mt-0.5 truncate text-xs text-ink-faint">{p.seoTitle}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-4">
                <span className="data-figure text-sm text-ink-muted">€{(p.priceCents / 100).toFixed(2)}</span>
                <span
                  className={`rounded-pill px-2.5 py-1 text-xs font-mono ${
                    p.status === "PUBLISHED"
                      ? "bg-signal-success/10 text-signal-success"
                      : p.status === "DRAFT"
                      ? "bg-signal-warning/10 text-signal-warning"
                      : "bg-surface-raised text-ink-faint"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
