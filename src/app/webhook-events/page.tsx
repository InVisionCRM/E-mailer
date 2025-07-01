import { Suspense } from 'react';

async function fetchEvents() {
  const res = await fetch('/api/webhook-events', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load events');
  const json = await res.json();
  return json.events as import('@/lib/webhookStore').ResendEvent[];
}

export default async function WebhookEventsPage() {
  const events = await fetchEvents();
  return (
    <div className="container py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Webhook Events</h1>
      <Suspense fallback={<p>Loading...</p>}>
        {events.length === 0 ? (
          <p>No events received yet.</p>
        ) : (
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(events, null, 2)}
          </pre>
        )}
      </Suspense>
    </div>
  );
}
