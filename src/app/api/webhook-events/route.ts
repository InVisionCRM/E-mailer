import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/webhookStore';

export function GET() {
  return NextResponse.json({ events: getEvents() });
}
