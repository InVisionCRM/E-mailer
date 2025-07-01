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

    // Resend allows max 50 recipients per request; batch if longer
    if (toEmails.length > 300) {
      return NextResponse.json(
        { error: 'Maximum 300 recipients per request.' },
        { status: 400 }
      );
    }

    const chunks: string[][] = [];
    for (let i = 0; i < toEmails.length; i += 50) {
      chunks.push(toEmails.slice(i, i + 50));
    }

    type EmailResult = Awaited<ReturnType<typeof sendEmail>>;
    const results: EmailResult[] = [];
    for (const chunk of chunks) {
      const res = await sendEmail({ to: chunk, subject, text, html });
      results.push(res);
      if (res.status === 'error') {
        break; // stop on first failure
      }
    }

    return NextResponse.json({ status: 'success', results });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
