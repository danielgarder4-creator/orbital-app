"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/dashboard");
  }

  return (
    <div className="surface-card p-8">
      <h1 className="font-display text-xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-muted">Log in to your Orbital dashboard.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-medium text-ink-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-orbit-violet/50 focus:outline-none"
          />
        </label>
        <label className="block">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-muted">Password</span>
            <Link href="/forgot-password" className="text-xs text-orbit-cyan hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-orbit-violet/50 focus:outline-none"
          />
        </label>

        {error && <p className="text-sm text-signal-danger">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        New to Orbital?{" "}
        <Link href="/signup" className="text-orbit-cyan hover:underline">
          Start for free
        </Link>
      </p>
    </div>
  );
}
