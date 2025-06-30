import { Resend } from 'resend';
import { SendEmailRequest } from '@/types/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(data: SendEmailRequest) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@example.com',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
    return { status: 'success', data: result };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { status: 'error', error: error.message };
  }
}
