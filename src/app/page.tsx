import { GuestbookForm } from "@/components/guestbook-form";
import { GuestbookEntries } from "@/components/guestbook-entries";
import { getEntries } from "@/lib/db";

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
    <div>
      <main>
        <header>
          <h1>
            Simple Guestbook
          </h1>
          <p>
            Leave a message for future visitors.
          </p>
        </header>

        <section>
          <h2>Leave Your Mark</h2>
          <GuestbookForm />
        </section>

        <section>
          {error ? (
             <div>
                <h3>Database Error</h3>
                <p>
                  {error}
                </p>
              </div>
          ) : (
            <GuestbookEntries entries={entries} />
          )}
        </section>
      </main>
    </div>
  );
}
