export default function SettingsPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your platform preferences.</p>
      </div>
      <div className="rounded-xl border bg-card p-12 flex items-center justify-center text-muted-foreground shadow-sm">
        <p>Settings Form Component</p>
      </div>
    </div>
  );
}
