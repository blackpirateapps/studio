import { GuestbookForm } from "@/components/guestbook-form";
import { GuestbookEntries } from "@/components/guestbook-entries";
import { getEntries } from "@/lib/db";
import { SeedButton } from "@/components/seed-button";

export default async function Home() {
  let entries = [];
  let error: string | null = null;
  
  try {
    entries = await getEntries();
  } catch (e) {
    console.error("Failed to fetch guestbook entries:", e);
    error = "Could not connect to the database. Please check the server configuration.";
  }

  const showSeedButton = !!process.env.ADMIN_SECRET;

  return (
    <div className="container">
      <main>
        <header>
          <h1>
            Sudip's Guestbook
          </h1>
          <p>
            Leave a message for me and future visitors.
          </p>
        </header>

        <section>
          <h2>Leave Your Mark</h2>
          <GuestbookForm />
        </section>

        <section>
          {error ? (
             <div>
                <h3>DatabaseError</h3>
                <p>
                  {error}
                </p>
              </div>
          ) : (
            <>
              {showSeedButton && <SeedButton />}
              <GuestbookEntries entries={entries} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
