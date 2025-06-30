import { EmailForm } from '@/components/EmailForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Email Sender</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Send Email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailForm />
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button variant="outline">
            <a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank">
              Deploy to Vercel
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
