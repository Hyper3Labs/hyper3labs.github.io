import type { MetadataRoute } from 'next';
import { docHref, getAllDocs } from '@/lib/docs';
import { SITE_URL as siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...getAllDocs().map((doc) => ({
      url: `${siteUrl}${docHref(doc)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
