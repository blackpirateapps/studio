import { createClient, type Client } from "@libsql/client";
import "dotenv/config";

let client: Client | null = null;

export function getDbClient(): Client {
  if (client) {
    return client;
  }
  
  if (process.env.NODE_ENV === 'production') {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error("TURSO_DATABASE_URL is not set for production");
    }
    
    client = createClient({
      url,
      authToken,
    });

  } else {
    // For local development, use a local SQLite file.
    client = createClient({
      url: "file:local.db",
    });
  }

  return client;
}

const db = getDbClient();

// Create table if not exists
async function initializeDb() {
  try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS guestbook (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          message TEXT NOT NULL,
          website TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
  } catch (error) {
      console.error("Failed to create guestbook table:", error);
  }
}

initializeDb();


export type Entry = {
  id: number;
  name: string;
  message: string;
  website: string | null;
  created_at: string;
};

export async function getEntries(): Promise<Entry[]> {
  const result = await db.execute("SELECT id, name, message, website, created_at FROM guestbook ORDER BY created_at DESC");
  return result.rows as unknown as Entry[];
}

type NewEntry = {
    name: string;
    message: string;
    website?: string | null;
}

export async function addEntry(entry: NewEntry) {
  await db.execute({
    sql: "INSERT INTO guestbook (name, message, website) VALUES (?, ?, ?)",
    args: [entry.name, entry.message, entry.website || null],
  });
}
