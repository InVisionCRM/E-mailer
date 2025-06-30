export type EmailStatus = 'pending' | 'success' | 'error';

export interface EmailData {
  id: string;
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  status: EmailStatus;
  createdAt: string;
  error?: string;
}

export interface SendEmailRequest {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}
