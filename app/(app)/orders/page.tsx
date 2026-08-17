const orders = [
  { id: "#1042", customer: "Elena V.", product: "Compact Massage Gun", total: "€38.00", status: "Fulfilled" },
  { id: "#1041", customer: "Tom R.", product: "Ceramic Pour-Over Kettle", total: "€27.50", status: "Pending" },
  { id: "#1040", customer: "Ana S.", product: "Magnetic Cable Organizer", total: "€12.90", status: "Fulfilled" },
  { id: "#1039", customer: "Liam K.", product: "Compact Massage Gun", total: "€38.00", status: "Refunded" },
];

const statusColor: Record<string, string> = {
  Fulfilled: "bg-signal-success/10 text-signal-success",
  Pending: "bg-signal-warning/10 text-signal-warning",
  Refunded: "bg-signal-danger/10 text-signal-danger",
};

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-ink-muted">All orders across your store.</p>
      </div>

      <div className="surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-ink-faint">
              <th className="px-6 py-3 font-medium">Order</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-3.5 font-mono text-ink-muted">{o.id}</td>
                <td className="px-6 py-3.5">{o.customer}</td>
                <td className="px-6 py-3.5 text-ink-muted">{o.product}</td>
                <td className="px-6 py-3.5 data-figure">{o.total}</td>
                <td className="px-6 py-3.5">
                  <span className={`rounded-pill px-2.5 py-1 text-xs font-mono ${statusColor[o.status]}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
