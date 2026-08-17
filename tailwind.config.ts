import type { Config } from "tailwindcss";

// ──────────────────────────────────────────────────────────────
// ORBITAL DESIGN TOKENS
// A near-black, instrument-panel foundation with a violet→cyan
// "orbit" gradient as the single accent signature. Data (scores,
// prices, percentages) is always set in the mono face so numbers
// read as measurements, not decoration.
// ──────────────────────────────────────────────────────────────

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#08080C",          // page background
        surface: {
          DEFAULT: "#111117",     // card background
          raised: "#181822",      // elevated card / popover
          sunken: "#0C0C11",      // inset wells (inputs, code)
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          hover: "rgba(255,255,255,0.16)",
        },
        ink: {
          DEFAULT: "#F3F3F7",     // primary text
          muted: "#9A9AAE",       // secondary text
          faint: "#5C5C6E",       // tertiary / placeholder
        },
        orbit: {
          violet: "#7C6CFF",
          cyan: "#2FD8E0",
          DEFAULT: "#7C6CFF",
        },
        signal: {
          success: "#34D399",
          warning: "#F5B94D",
          danger: "#FB7185",
          info: "#4CC9F0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "orbit-gradient": "linear-gradient(135deg, #7C6CFF 0%, #2FD8E0 100%)",
        "orbit-radial": "radial-gradient(circle at 50% 0%, rgba(124,108,255,0.16), transparent 60%)",
        "grain": "url('/noise.png')",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124,108,255,0.45)",
        "glow-cyan": "0 0 40px -10px rgba(47,216,224,0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
      keyframes: {
        "orbit-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "orbit-spin-slow": "orbit-spin 12s linear infinite",
        "rise-in": "rise-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
