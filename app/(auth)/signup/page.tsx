"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.formErrors?.[0] ?? data.error ?? "Something went wrong.");
        return;
      }

      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created — please log in.");
        router.push("/login");
        return;
      }

      router.push("/onboarding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card p-8">
      <h1 className="font-display text-xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-ink-muted">Your first product is free — no card required.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Name" name="name" type="text" placeholder="Jordan Lee" />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />

        {error && <p className="text-sm text-signal-danger">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start For Free"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-orbit-cyan hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({ label, name, type, placeholder }: { label: string; name: string; type: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        minLength={name === "password" ? 8 : undefined}
        className="mt-1.5 w-full rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-orbit-violet/50 focus:outline-none"
      />
    </label>
  );
}
