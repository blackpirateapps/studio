import type {Metadata} from 'next';
import './custom.css';

export const metadata: Metadata = {
  title: 'Simple Guestbook',
  description: 'A simple guestbook application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
