import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'hyper³labs Docs',
    short_name: 'hyper³labs',
    description:
      'Documentation for HyperView, hyper-models and hyper-scatter, open-source tools from hyper³labs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/brand-assets/hyper3labs-logo-primary-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/brand-assets/hyper3labs-logo-primary-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
