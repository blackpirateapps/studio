
'use client';

import { getEntries } from "@/lib/db";
import { GuestbookForm } from "@/components/guestbook-form";
import { deleteEntry } from "@/app/actions";
import { EditEntryForm } from "./edit-entry-form";
import { useState, useEffect } from "react";
import type { Entry } from "@/lib/db";

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSecretSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const secretInput = formData.get("secret") as string;
    
    // In a real app, you'd want to verify this on the server.
    // For this prototype, we'll just set it in state.
    // A better approach would be a server action that returns a session token.
    setSecret(secretInput);
  };
  
  useEffect(() => {
    async function loadEntries() {
      if (!secret) return;
      setLoading(true);
      setError(null);
      try {
        const rawEntries = await getEntries();
        // Ensure entries are plain objects
        const plainEntries = rawEntries.map(entry => ({ ...entry }));
        setEntries(plainEntries);
      } catch (e) {
        console.error(e);
        setError("Failed to load entries.");
      } finally {
        setLoading(false);
      }
    }
    loadEntries();
  }, [secret]);

  if (!secret) {
    return (
      <div className="container">
        <h1>Admin Access</h1>
        <form onSubmit={handleSecretSubmit} className="guestbook-form">
          <div className="form-field">
            <label htmlFor="secret">Admin Secret</label>
            <input type="password" id="secret" name="secret" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  
  // NOTE: This is a simplified check for demo purposes.
  // In a production app, this check MUST happen on the server-side
  // for every action to prevent unauthorized access.
  if (secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      return (
        <div className="container">
          <h1>Unauthorized</h1>
          <p>The secret you provided is incorrect.</p>
           <button onClick={() => setSecret(null)}>Try Again</button>
        </div>
      );
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
         {loading && <p>Loading entries...</p>}
         {error && <p className="form-error">{error}</p>}
        <div className="entries-container">
          {entries.map((entry) => (
            <div key={entry.id} className="guestbook-entry">
              <EditEntryForm entry={entry} adminSecret={secret} />

              <form action={deleteEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <input type="hidden" name="adminSecret" value={secret} />
                  <button type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
