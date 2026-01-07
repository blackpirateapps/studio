import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Entry } from '@/lib/db';
import { ExternalLink } from 'lucide-react';

type GuestbookEntriesProps = {
  entries: Entry[];
};

export function GuestbookEntries({ entries }: GuestbookEntriesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-headline font-semibold">Entries</h2>
      {entries.length === 0 ? (
        <Card>
            <CardContent className="pt-6">
                <p>No entries yet. Be the first to sign!</p>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="break-words">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{entry.name}</span>
                {entry.website && (
                  <a href={entry.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </CardTitle>
              <CardDescription>
                {new Date(entry.created_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{entry.message}</p>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
}
