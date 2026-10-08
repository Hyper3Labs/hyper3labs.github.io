import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocsSidebar from '@/components/DocsSidebar';
import Markdown from '@/components/Markdown';
import { getAllDocs, getDoc } from '@/lib/docs';

const EDIT_BASE = 'https://github.com/Hyper3Labs/hyper3labs.github.io/edit/main/content/docs';

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getDoc(params.slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/docs/${doc.slug}/` },
    openGraph: { title: `${doc.title} — HyperView docs`, description: doc.description, url: `/docs/${doc.slug}/` },
  };
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const docs = getAllDocs();
  const index = docs.findIndex((d) => d.slug === params.slug);
  const doc = docs[index];
  if (!doc) notFound();
  const prev = docs[index - 1];
  const next = docs[index + 1];
  const nav = docs.map(({ slug, title, section }) => ({ slug, title, section }));

  return (
    <>
      <Header />
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <aside className="hidden lg:block">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-10">
            <DocsSidebar docs={nav} active={doc.slug} />
          </div>
        </aside>

        <main className="min-w-0 py-10">
          <details className="mb-8 rounded-lg border border-white/[0.08] lg:hidden">
            <summary className="cursor-pointer px-4 py-2.5 text-sm text-gray-300">Documentation menu</summary>
            <div className="border-t border-white/[0.07] px-1 py-3">
              <DocsSidebar docs={nav} active={doc.slug} />
            </div>
          </details>

          <p className="mb-2 font-mono text-xs text-cyan-300">{doc.section}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{doc.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-400">{doc.description}</p>
          <div className="mt-8 max-w-3xl">
            <Markdown>{doc.content}</Markdown>
          </div>

          <div className="mt-14 grid max-w-3xl gap-3 border-t border-white/[0.07] pt-6 sm:grid-cols-2">
            {prev ? (
              <a href={`/docs/${prev.slug}/`} className="rounded-lg border border-white/[0.08] p-4 hover:border-white/[0.2]">
                <span className="flex items-center gap-1 text-xs text-gray-500"><ArrowLeft className="h-3 w-3" /> Previous</span>
                <span className="mt-1 block text-sm text-white">{prev.title}</span>
              </a>
            ) : <span />}
            {next ? (
              <a href={`/docs/${next.slug}/`} className="rounded-lg border border-white/[0.08] p-4 text-right hover:border-white/[0.2]">
                <span className="flex items-center justify-end gap-1 text-xs text-gray-500">Next <ArrowRight className="h-3 w-3" /></span>
                <span className="mt-1 block text-sm text-white">{next.title}</span>
              </a>
            ) : null}
          </div>
          <a href={`${EDIT_BASE}/${doc.slug}.md`} className="mt-6 inline-block text-xs text-gray-500 hover:text-gray-300">
            Edit this page on GitHub
          </a>
        </main>

        <aside className="hidden xl:block">
          {doc.headings.length ? (
            <nav aria-label="On this page" className="sticky top-14 py-10 text-sm">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-600">On this page</p>
              <ul className="space-y-1.5 border-l border-white/[0.08] pl-3">
                {doc.headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="block text-gray-500 transition hover:text-white">{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>
      <Footer />
    </>
  );
}
