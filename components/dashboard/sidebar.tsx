"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Package, Store, Sparkles, Megaphone,
  ShoppingCart, LineChart, Truck, Tags, Zap, Settings, CreditCard,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products/find", label: "Find Products", icon: Search },
  { href: "/products/mine", label: "My Products", icon: Package },
  { href: "/store-builder", label: "AI Store Builder", icon: Store },
  { href: "/ai-content", label: "AI Content", icon: Sparkles },
  { href: "/ai-ads", label: "AI Ads", icon: Megaphone },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/seo", label: "SEO", icon: Tags },
  { href: "/automations", label: "Automations", icon: Zap },
];

const bottomNav = [
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-void/95 lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="h-7 w-7 rounded-full bg-orbit-gradient" />
        <span className="font-display text-base font-semibold">Orbital</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {nav.map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} />
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-border px-3 py-3">
        {bottomNav.map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} />
        ))}
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
        active ? "bg-surface-raised text-ink" : "text-ink-muted hover:bg-surface-raised/60 hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </Link>
  );
}
