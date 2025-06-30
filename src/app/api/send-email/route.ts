import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { SendEmailRequest } from '@/types/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body as SendEmailRequest;

    let toEmails: string[];

    if (typeof to === 'string') {
      toEmails = to.split(',').map((email: string) => email.trim());
    } else if (Array.isArray(to)) {
      toEmails = to.map((email: string) => email.trim());
    } else {
      return NextResponse.json(
        { error: 'Invalid "to" field format' },
        { status: 400 }
      );
    }

    if (toEmails.length === 0 || !subject || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendEmail({ to: toEmails, subject, text, html });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
