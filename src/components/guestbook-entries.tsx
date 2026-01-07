import type { Entry } from '@/lib/db';

type GuestbookEntriesProps = {
  entries: Entry[];
};

export function GuestbookEntries({ entries }: GuestbookEntriesProps) {
  return (
    <div>
      <h2>Entries</h2>
      {entries.length === 0 ? (
        <div className="entry-card">
            <p>No entries yet. Be the first to sign!</p>
        </div>
      ) : (
        <div className="entries-container">
        {entries.map((entry) => (
          <div key={entry.id} className="entry-card">
            <div className="entry-header">
              <h3>
                <span className="entry-name">{entry.name}</span>
                {entry.website && (
                  <a href={entry.website} target="_blank" rel="noopener noreferrer">
                    website
                  </a>
                )}
              </h3>
              <p className="entry-date">
                {new Date(entry.created_at).toLocaleString()}
              </p>
            </div>
            <div className="entry-body">
              <p>{entry.message}</p>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
