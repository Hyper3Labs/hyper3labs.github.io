import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export type DocHeading = { id: string; text: string };

export type Doc = {
  project: string;
  slug: string;
  title: string;
  description: string;
  section: string;
  order: number;
  content: string;
  headings: DocHeading[];
};

export const DOC_SECTIONS = ['Get started', 'Guides', 'Reference'] as const;

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs');

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function readDoc(project: string, file: string): Doc {
  const raw = fs.readFileSync(path.join(DOCS_DIR, project, file), 'utf-8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter in content/docs/${project}/${file}`);
  const meta = parse(match[1]) as Partial<Doc>;
  const content = match[2].trim();

  const headings: DocHeading[] = [];
  let inFence = false;
  for (const line of content.split('\n')) {
    if (line.startsWith('```')) inFence = !inFence;
    if (!inFence && line.startsWith('## ')) {
      const text = line.slice(3).trim();
      headings.push({ id: slugify(text), text: text.replace(/`/g, '') });
    }
  }

  return {
    project,
    slug: file.replace(/\.md$/, ''),
    title: meta.title ?? file,
    description: meta.description ?? '',
    section: meta.section ?? 'Guides',
    order: meta.order ?? 99,
    content,
    headings,
  };
}

// Docs live in content/docs/<project>/<slug>.md and render at /docs/<project>/<slug>/.
export function getProjectDocs(project: string): Doc[] {
  const dir = path.join(DOCS_DIR, project);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => readDoc(project, file))
    .sort((a, b) => a.order - b.order);
}

export function getAllDocs(): Doc[] {
  return fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => getProjectDocs(entry.name));
}

export function docHref(doc: Pick<Doc, 'project' | 'slug'>): string {
  return `/docs/${doc.project}/${doc.slug}/`;
}
