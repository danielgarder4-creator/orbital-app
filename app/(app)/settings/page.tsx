export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage your profile and preferences.</p>
      </div>

      <div className="surface-card space-y-5 p-6">
        <h3 className="font-display text-sm font-medium">Profile</h3>
        <Field label="Name" defaultValue="Jordan Lee" />
        <Field label="Email" defaultValue="jordan@example.com" />
        <button className="btn-primary">Save Changes</button>
      </div>

      <div className="surface-card space-y-4 p-6">
        <h3 className="font-display text-sm font-medium">Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">Theme</span>
          <div className="flex gap-2">
            <button className="rounded-pill bg-orbit-gradient px-3.5 py-1.5 text-xs text-void">Dark</button>
            <button className="rounded-pill border border-border px-3.5 py-1.5 text-xs text-ink-muted">Light</button>
          </div>
        </div>
      </div>

      <div className="surface-card border-signal-danger/25 p-6">
        <h3 className="font-display text-sm font-medium text-signal-danger">Danger zone</h3>
        <p className="mt-1 text-xs text-ink-muted">Deleting your account removes all products, stores, and orders.</p>
        <button className="btn-secondary mt-4 border-signal-danger/30 text-signal-danger">Delete Account</button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <input
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-ink focus:border-orbit-violet/50 focus:outline-none"
      />
    </label>
  );
}
