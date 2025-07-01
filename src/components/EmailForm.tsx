'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { parseRecipientFile } from '@/lib/import';
import UploadArea from '@/components/UploadArea';

const formSchema = z.object({
  to: z
    .string()
    .min(1, 'Recipient email is required.')
    .refine(
      (value) => {
        const emails = value.split(',').map((email) => email.trim());
        return emails.every((email) => z.string().email().safeParse(email).success);
      },
      {
        message: 'Please provide a valid, comma-separated list of email addresses.',
      }
    ),
  subject: z.string().min(1, 'Subject is required'),
  text: z.string().min(1, 'Message is required'),
  html: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailCount, setEmailCount] = useState(0);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: '',
      subject: '',
      text: '',
      html: '',
    },
  });

  async function handleFileUpload(file: File) {
    const uploadedFile = file;
    if (!uploadedFile) return;
    try {
      const emails = await parseRecipientFile(uploadedFile);
      if (emails.length === 0) {
        toast.error('No valid email addresses found in file.');
        return;
      }
      const existing = form.getValues('to');
      const combined = [...new Set([...existing.split(',').map((e) => e.trim()).filter(Boolean), ...emails])];
      if (combined.length > 50) {
        toast.error('Maximum 50 recipients allowed at once.');
        return;
      }
      form.setValue('to', combined.join(', '));
      setEmailCount(combined.length);
      toast.success(`${emails.length} email addresses imported.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse file. Ensure it is a valid CSV or Excel file.');
    }
  }

  async function onSubmit(values: FormValues) {
    const recipients = values.to.split(',').map((e) => e.trim()).filter(Boolean);
    if (recipients.length > 50) {
      toast.error('Maximum 50 recipients allowed at once.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const resJson = await response.json();
      if (!response.ok || resJson.error) {
        toast.error(resJson.error ?? 'Failed to send email');
        return;
      }

      toast.success(`Email sent successfully to ${recipients.length} recipients.`);
      setEmailCount(0);
      form.reset();
    } catch {
      // The error is not used, but we want to show a generic message.
      // For more detailed error handling, you could log the error to a service.
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <FormControl>
                <Input placeholder="recipient1@example.com, recipient2@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File import */}
        <div className="space-y-2">
          <UploadArea onFileSelected={handleFileUpload} />
          {emailCount > 0 && (
            <p className="text-sm text-muted-foreground">{emailCount} recipients loaded</p>
          )}
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Your subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="html"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HTML Message (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your HTML message..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Email'}
        </Button>
              <p className="text-sm text-muted-foreground">
          Want to see delivery events?{' '}
          <a href="/webhook-events" className="underline hover:text-primary">
            View webhook responses
          </a>
        </p>
      </form>
    </Form>
  );
}
