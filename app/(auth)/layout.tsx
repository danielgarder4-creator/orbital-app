import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none fixed inset-0 bg-orbit-radial" />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold">
          <span className="h-7 w-7 rounded-full bg-orbit-gradient" />
          Orbital
        </Link>
        {children}
      </div>
    </div>
  );
}
