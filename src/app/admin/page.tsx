
'use client';

import { GuestbookForm } from "@/components/guestbook-form";
import { EditEntryForm } from "./edit-entry-form";
import { useState } from "react";
import type { Entry } from "@/lib/db";
import { getAdminEntries } from "./actions";

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secretInput, setSecretInput] = useState('');

  const handleSecretSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const plainEntries = await getAdminEntries(secretInput);
      setEntries(plainEntries);
      setSecret(secretInput);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to load entries.");
      setSecret(null);
    } finally {
      setLoading(false);
    }
  };
  
  if (!secret) {
    return (
      <div className="container">
        <h1>Admin Access</h1>
        <form onSubmit={handleSecretSubmit} className="guestbook-form">
          <div className="form-field">
            <label htmlFor="secret">Admin Secret</label>
            <input 
              type="password" 
              id="secret" 
              name="secret" 
              required 
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="form-error" style={{color: 'red'}}>{error}</p>}
        </form>
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
        <div className="entries-container">
          {entries.map((entry) => (
            <div key={entry.id}>
              <EditEntryForm entry={entry} adminSecret={secret} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
