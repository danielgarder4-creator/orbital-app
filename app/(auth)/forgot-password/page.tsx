"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="surface-card p-8 text-center">
        <h1 className="font-display text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-ink-muted">
          If an account exists for that address, a reset link is on its way.
        </p>
        <Link href="/login" className="btn-secondary mt-6 w-full">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="surface-card p-8">
      <h1 className="font-display text-xl font-semibold">Reset your password</h1>
      <p className="mt-1 text-sm text-ink-muted">We'll send a reset link to your email.</p>

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
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        <Link href="/login" className="text-orbit-cyan hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
