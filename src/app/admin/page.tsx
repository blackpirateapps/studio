import { getEntries } from "@/lib/db";
import { GuestbookForm } from "@/components/guestbook-form";
import { deleteEntry } from "@/app/actions";
import { EditEntryForm } from "./edit-entry-form";


export default async function AdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const secret = searchParams.secret;

  if (secret !== process.env.ADMIN_SECRET) {
    return (
      <div className="container">
        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  let entries = [];
  try {
    const rawEntries = await getEntries();
    // Ensure entries are plain objects before passing to client components
    entries = rawEntries.map(entry => ({
      id: entry.id,
      name: entry.name,
      message: entry.message,
      website: entry.website,
      created_at: entry.created_at,
    }));
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="container">
      <header>
        <h1>Admin Dashboard</h1>
        <p>Welcome, admin. Here you can manage guestbook entries.</p>
      </header>

      <section>
        <h2>Add New Entry</h2>
        <GuestbookForm />
      </section>

      <section>
        <h2>Manage Entries</h2>
        <div className="entries-container">
          {entries.map((entry) => (
            <div key={entry.id} className="guestbook-entry">
              <EditEntryForm entry={entry} adminSecret={secret as string} />

              <form action={deleteEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <input type="hidden" name="adminSecret" value={secret as string} />
                  <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
