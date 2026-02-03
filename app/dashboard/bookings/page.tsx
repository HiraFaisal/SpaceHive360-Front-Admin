export default function BookingsPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Manage reservations and schedules.</p>
      </div>
      <div className="rounded-xl border bg-card p-12 flex items-center justify-center text-muted-foreground shadow-sm">
        <p>Bookings List Component</p>
      </div>
    </div>
  );
}
