import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'hyper₃labs — Non-Euclidean Embeddings',
  description:
    'Open-source tools for non-Euclidean embeddings and dataset curation.',
  openGraph: {
    title: 'hyper₃labs — Non-Euclidean Embeddings',
    description:
      'Open-source tools for non-Euclidean embeddings and dataset curation.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="antialiased bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
