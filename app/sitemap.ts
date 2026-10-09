import type { MetadataRoute } from 'next';
import { getAllDocs } from '@/lib/docs';
import { SITE_URL as siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/examples/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...getAllDocs().map((doc) => ({
      url: `${siteUrl}/docs/${doc.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
