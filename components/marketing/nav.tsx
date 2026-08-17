import Link from "next/link";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-void/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-orbit-gradient">
            <span className="absolute inset-0 rounded-full border border-white/30 animate-orbit-spin-slow" style={{ borderStyle: "dashed" }} />
          </span>
          Orbital
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-ink-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost hidden sm:inline-flex">
            Log in
          </Link>
          <Link href="/signup" className="btn-primary">
            Start Free
          </Link>
        </div>
      </nav>
    </header>
  );
}
