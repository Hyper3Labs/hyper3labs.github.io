import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

const contentDir = path.join(process.cwd(), 'content', 'blog');
const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

interface FrontmatterData {
  title?: unknown;
  date?: unknown;
  description?: unknown;
  cover?: unknown;
  coverAlt?: unknown;
  showCover?: unknown;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover: string | null;
  coverAlt: string;
  /**
   * Whether to render the cover image as a hero figure inside the post.
   * The cover is always used for OG / Twitter / social previews regardless.
   * Defaults to true when a cover is set.
   */
  showCover: boolean;
  content: string;
}

interface BlogPostSource {
  slug: string;
  filePath: string;
}

const postIndexFileName = 'index.md';

function getDateFromParts(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function parseBlogDate(date: string): Date {
  const trimmedDate = date.trim();
  const dateOnlyMatch = trimmedDate.match(dateOnlyPattern);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return getDateFromParts(Number(year), Number(month), Number(day));
  }

  const parsedDate = new Date(trimmedDate);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid blog post date: ${date}`);
  }

  return parsedDate;
}

function normalizeFrontmatterDate(rawDate: unknown, slug: string): string {
  if (typeof rawDate === 'string' && rawDate.trim()) {
    return rawDate.trim();
  }

  if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
    return rawDate.toISOString().slice(0, 10);
  }

  throw new Error(`Post "${slug}" is missing a valid date.`);
}

function normalizeFrontmatterTitle(rawTitle: unknown, slug: string): string {
  if (typeof rawTitle === 'string' && rawTitle.trim()) {
    return rawTitle.trim();
  }

  throw new Error(`Post "${slug}" is missing a valid title.`);
}

function normalizeFrontmatterDescription(rawDescription: unknown): string {
  return typeof rawDescription === 'string' ? rawDescription.trim() : '';
}

function normalizeFrontmatterCover(rawCover: unknown, slug: string): string | null {
  if (typeof rawCover !== 'string' || !rawCover.trim()) {
    return null;
  }

  const cover = rawCover.trim();

  if (/^https?:\/\//i.test(cover) || cover.startsWith('/')) {
    return cover;
  }

  // Resolve relative paths (e.g. ./assets/foo.png) against the public blog
  // assets directory so the URL works on every page that references it.
  const stripped = cover.replace(/^\.\//, '');
  return `/blog/${slug}/${stripped}`;
}

function normalizeFrontmatterCoverAlt(rawCoverAlt: unknown, fallbackTitle: string): string {
  if (typeof rawCoverAlt === 'string' && rawCoverAlt.trim()) {
    return rawCoverAlt.trim();
  }
  return `Cover image for ${fallbackTitle}`;
}

function normalizeFrontmatterShowCover(rawShowCover: unknown): boolean {
  if (typeof rawShowCover === 'boolean') {
    return rawShowCover;
  }
  return true;
}

function isIgnoredContentEntry(name: string): boolean {
  return name.startsWith('.') || name.startsWith('_') || name === 'README.md';
}

function getPostSources(): BlogPostSource[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs.readdirSync(contentDir, { withFileTypes: true }).flatMap((entry) => {
    if (isIgnoredContentEntry(entry.name)) {
      return [];
    }

    if (entry.isDirectory()) {
      const filePath = path.join(contentDir, entry.name, postIndexFileName);

      if (!fs.existsSync(filePath)) {
        return [];
      }

      return [{ slug: entry.name, filePath }];
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      return [{
        slug: entry.name.replace(/\.md$/, ''),
        filePath: path.join(contentDir, entry.name),
      }];
    }

    return [];
  });
}

function getPostSourceBySlug(slug: string): BlogPostSource | null {
  const directoryFilePath = path.join(contentDir, slug, postIndexFileName);

  if (fs.existsSync(directoryFilePath)) {
    return {
      slug,
      filePath: directoryFilePath,
    };
  }

  const legacyFilePath = path.join(contentDir, `${slug}.md`);

  if (fs.existsSync(legacyFilePath)) {
    return {
      slug,
      filePath: legacyFilePath,
    };
  }

  return null;
}

export function formatBlogDate(
  date: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    ...options,
  }).format(parseBlogDate(date));
}

/**
 * Rewrite markdown image URLs that are co-located with the post (e.g.
 * `./assets/foo.png`) into absolute public URLs (`/blog/<slug>/assets/foo.png`).
 *
 * Using relative URLs breaks during Next.js client-side navigation: the `<img>`
 * tags start fetching before `document.baseURI` updates, which resolves `./`
 * against the previous page and 404s. Rewriting to absolute paths also makes
 * the same markdown work correctly for RSS, OG scrapers, and static exports.
 */
function rewriteRelativeImageUrls(markdown: string, slug: string): string {
  const prefix = `/blog/${slug}/`;
  // Inline images: ![alt](./path "title")
  const inline = markdown.replace(
    /(!\[[^\]]*\]\()(\.\/)([^)\s]+)/g,
    (_, open, _dot, rest) => `${open}${prefix}${rest}`,
  );
  // Reference-style definitions: [id]: ./path "title"
  return inline.replace(
    /^(\s*\[[^\]]+\]:\s*)(\.\/)([^\s]+)/gm,
    (_, open, _dot, rest) => `${open}${prefix}${rest}`,
  );
}

function parseFrontmatter(fileContents: string): {
  data: FrontmatterData;
  content: string;
} {
  const frontmatterMatch = fileContents.match(frontmatterPattern);

  if (!frontmatterMatch) {
    return {
      data: {},
      content: fileContents,
    };
  }

  const [, rawFrontmatter] = frontmatterMatch;
  const parsed = parseYaml(rawFrontmatter);

  if (parsed !== null && typeof parsed !== 'object') {
    throw new Error('Blog frontmatter must parse to an object.');
  }

  return {
    data: (parsed as FrontmatterData | null) ?? {},
    content: fileContents.slice(frontmatterMatch[0].length),
  };
}

export function getAllPosts(): BlogPost[] {
  const posts = getPostSources()
    .map((source) => getPostBySlug(source.slug))
    .filter(Boolean) as BlogPost[];

  return posts.sort((a, b) => parseBlogDate(b.date).getTime() - parseBlogDate(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const source = getPostSourceBySlug(slug);

    if (!source) {
      return null;
    }

    const fileContents = fs.readFileSync(source.filePath, 'utf8');
    const { data, content } = parseFrontmatter(fileContents);
    const title = normalizeFrontmatterTitle(data.title, slug);

    return {
      slug,
      title,
      date: normalizeFrontmatterDate(data.date, slug),
      description: normalizeFrontmatterDescription(data.description),
      cover: normalizeFrontmatterCover(data.cover, slug),
      coverAlt: normalizeFrontmatterCoverAlt(data.coverAlt, title),
      showCover: normalizeFrontmatterShowCover(data.showCover),
      content: rewriteRelativeImageUrls(content, slug),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Failed to load blog post "${slug}".`, error);
    }

    return null;
  }
}
