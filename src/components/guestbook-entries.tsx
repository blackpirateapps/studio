import type { Entry } from '@/lib/db';

type GuestbookEntriesProps = {
  entries: Entry[];
};

export function GuestbookEntries({ entries }: GuestbookEntriesProps) {
  return (
    <div>
      <h2>Entries</h2>
      {entries.length === 0 ? (
        <div className="guestbook-entry">
            <p>No entries yet. Be the first to sign!</p>
        </div>
      ) : (
        <div className="entries-container">
        {entries.map((entry) => (
          <div key={entry.id} className="guestbook-entry">
            <div className="entry-header">
              <h3>
                <span className="entry-name">{entry.name}</span>
              </h3>
              <p className="entry-date">
                {new Date(entry.created_at).toLocaleString('en-US')}
              </p>
            </div>
             {entry.website && (
                <a href={entry.website} target="_blank" rel="noopener noreferrer" className="entry-website">
                    {entry.website}
                </a>
            )}
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
