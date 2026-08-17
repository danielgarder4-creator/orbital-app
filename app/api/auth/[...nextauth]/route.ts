import { handlers } from "@/lib/auth/config";

// ──────────────────────────────────────────────────────────────
// Wires NextAuth's GET/POST handlers to /api/auth/[...nextauth].
// This is what powers /api/auth/callback/credentials (used by the
// login form) and /api/auth/session (used by client components
// that need the current session).
// ──────────────────────────────────────────────────────────────

export const { GET, POST } = handlers;
