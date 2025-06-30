import { Resend } from 'resend';
import { SendEmailRequest } from '@/types/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(data: SendEmailRequest) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
    return { status: 'success', data: result };
  } catch (error: unknown) {
    console.error('Email sending failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { status: 'error', error: message };
  }
}
