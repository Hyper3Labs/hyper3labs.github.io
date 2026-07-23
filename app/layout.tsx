import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://hyper3labs.github.io';
const siteName = 'hyper³labs';
const title = 'hyper³labs Docs — HyperView';
const description =
  'Documentation and explorable Spaces for HyperView, the agent-native multimodal data workbench from hyper³labs.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s — hyper³labs',
  },
  description,
  applicationName: siteName,
  manifest: '/manifest.webmanifest',
  authors: [{ name: 'hyper³labs', url: siteUrl }],
  creator: 'hyper³labs',
  publisher: 'hyper³labs',
  keywords: [
    'HyperView',
    'multimodal data workbench',
    'dataset visualization',
    'embedding visualization',
    'agent-native tools',
    'developer documentation',
    'open source',
    'hyper3labs',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title,
    description,
    locale: 'en_US',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/default.png'],
  },
  icons: {
    icon: [
      { url: '/brand-assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand-assets/hyper3labs-logo-primary.svg', type: 'image/svg+xml' },
      { url: '/brand-assets/hyper3labs-logo-primary-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/brand-assets/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
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
