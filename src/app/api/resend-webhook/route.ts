import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { pushEvent } from '@/lib/webhookStore';

// If you enable signing in Resend, set RESEND_WEBHOOK_SECRET in Vercel.
// Then uncomment the signature verification block below.
// import crypto from 'crypto';

export async function POST(req: NextRequest) {
  // ----- Signature verification enabled -----
    const signature = req.headers.get('resend-signature');
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  const rawBody = await req.text();

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  if (signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  pushEvent(event);
  console.log('Verified Resend webhook:', event);

  // TODO: persist event in DB or trigger business logic here.

  return NextResponse.json({ received: true });
}
