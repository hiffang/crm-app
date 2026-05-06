import AppShell from "@/app/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Settings
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">Workspace</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Settings are coming soon. Use this space for team members, pipelines,
          and notifications.
        </div>
      </div>
    </AppShell>
  );
}
