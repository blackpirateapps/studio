import { GuestbookForm } from "@/components/guestbook-form";
import { GuestbookEntries } from "@/components/guestbook-entries";
import { getEntries } from "@/lib/db";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default async function Home() {
  let entries = [];
  let error: string | null = null;
  
  try {
    entries = await getEntries();
  } catch (e) {
    console.error("Failed to fetch guestbook entries:", e);
    error = "Could not connect to the database. Please check the server configuration.";
  }

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
        <header className="text-center my-8">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground tracking-tight">
            Simple Guestbook
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Leave a message for future visitors.
          </p>
        </header>

        <section className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-headline font-semibold mb-4">Leave Your Mark</h2>
          <GuestbookForm />
        </section>

        <section className="mt-12">
          {error ? (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Database Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
          ) : (
            <GuestbookEntries entries={entries} />
          )}
        </section>
      </main>
    </div>
  );
}
