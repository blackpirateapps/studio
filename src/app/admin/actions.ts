
'use server';

import { getEntries, type Entry } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function getAdminEntries(secret: string): Promise<Entry[]> {
  noStore();
  if (process.env.ADMIN_SECRET !== secret) {
    throw new Error('Unauthorized.');
  }

  try {
    const rawEntries = await getEntries();
    // Ensure entries are plain objects before returning to client
    const plainEntries = rawEntries.map(entry => ({ 
        ...entry,
        created_at: new Date(entry.created_at).toISOString() 
    }));
    return plainEntries;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to load entries from database.');
  }
}
