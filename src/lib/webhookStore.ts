/* Simple in-memory storage for webhook events.
 * In production you would persist to a database instead.
 */
export interface ResendEvent {
  id?: string;
  type?: string;
  [key: string]: unknown;
}

const events: ResendEvent[] = [];

export function pushEvent(evt: ResendEvent) {
  events.unshift({ ...evt, receivedAt: new Date().toISOString() });
  // Keep only latest 1000 to avoid unbounded memory usage
  if (events.length > 1000) events.pop();
}

export function getEvents() {
  return events;
}
