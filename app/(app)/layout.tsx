import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentUser } from "@/lib/auth/session";

// Middleware already guarantees a session exists for every route under
// this layout, so getCurrentUser() here is just fetching the profile
// data the shell needs to render (plan badge, avatar) — not gating.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-void">
      <Sidebar />
      <div className="lg:pl-60">
        <Topbar plan={user?.subscription?.plan ?? "FREE"} userName={user?.name ?? undefined} />
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
