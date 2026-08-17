"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const steps = [
  { key: "niche", question: "What type of products do you want to sell?", options: ["Fitness & wellness", "Home & kitchen", "Beauty & skincare", "Tech accessories"] },
  { key: "market", question: "What is your target market?", options: ["United States", "Europe", "United Kingdom", "Worldwide"] },
  { key: "budget", question: "What is your budget?", options: ["Under €200/mo", "€200–€1,000/mo", "€1,000–€5,000/mo", "€5,000+/mo"] },
  { key: "hasStore", question: "Do you already have a store?", options: ["Yes, I have one", "No, starting fresh"] },
  { key: "experience", question: "What is your experience level?", options: ["Complete beginner", "Some experience", "Experienced seller"] },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  function choose(option: string) {
    const key = steps[step].key;
    setAnswers((a) => ({ ...a, [key]: option }));

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setGenerating(true);
      setTimeout(() => {
        setGenerating(false);
        setDone(true);
      }, 1800);
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-signal-success" strokeWidth={1.5} />
        <h1 className="mt-6 font-display text-2xl font-semibold">Your AI store is ready.</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Based on {answers.niche}, we've personalized your dashboard and pre-loaded product
          suggestions for {answers.market}.
        </p>
        <a href="/dashboard" className="btn-primary mt-8">
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-orbit-violet" />
        <p className="font-display text-sm text-ink-muted">Setting up your personalized AI store…</p>
      </div>
    );
  }

  const current = steps[step];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none fixed inset-0 bg-orbit-radial" />
      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex items-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-orbit-gradient" : "bg-surface-raised"}`} />
          ))}
        </div>

        <div className="surface-card p-8">
          <span className="label-eyebrow">
            Step {step + 1} of {steps.length}
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold">{current.question}</h1>

          <div className="mt-6 space-y-2.5">
            {current.options.map((opt) => (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-sunken px-4 py-3.5 text-left text-sm transition-colors hover:border-orbit-violet/40 hover:bg-orbit-violet/5"
              >
                {opt}
                <ArrowRight className="h-4 w-4 text-ink-faint" />
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-faint">
          <Sparkles className="h-3.5 w-3.5" /> Orbital uses this to personalize your product suggestions
        </p>
      </div>
    </div>
  );
}
