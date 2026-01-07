import type { Entry } from '@/lib/db';

type GuestbookEntriesProps = {
  entries: Entry[];
};

export function GuestbookEntries({ entries }: GuestbookEntriesProps) {
  return (
    <div>
      <h2>Entries</h2>
      {entries.length === 0 ? (
        <div>
            <p>No entries yet. Be the first to sign!</p>
        </div>
      ) : (
        <div>
        {entries.map((entry) => (
          <div key={entry.id}>
            <div>
              <h3>
                <span>{entry.name}</span>
                {entry.website && (
                  <a href={entry.website} target="_blank" rel="noopener noreferrer">
                    website
                  </a>
                )}
              </h3>
              <p>
                {new Date(entry.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p>{entry.message}</p>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
