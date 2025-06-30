# Email Sender App

A modern email sending application built with Next.js, TypeScript, and Tailwind CSS. This app allows you to send emails manually through a form interface or set up automated email triggers.

## Features

- Manual email sending through a form interface
- Support for both text and HTML emails
- Real-time status feedback
- Clean, modern UI using shadcn/ui components
- API integration with Resend
- Deploy-ready on Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Resend API key:
   ```
   RESEND_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```
RESEND_API_KEY=your_api_key_here
```

You can get a Resend API key from [Resend's website](https://resend.com).

## Project Structure

- `/src/app` - Next.js app directory
- `/src/components` - React components
- `/src/lib` - Utility functions and services
- `/src/types` - TypeScript type definitions
- `/src/app/api` - API routes

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Resend API
- Vercel KV (optional for scheduled emails)

## Deployment

The app is ready to be deployed to Vercel. To deploy:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy to production

## License

MIT
# E-mailer
