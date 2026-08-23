import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Metadata } from 'next';
import Image from 'next/image';
import { formatBlogDate, getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import 'katex/dist/katex.min.css';

const siteUrl = 'https://hyper3labs.github.io';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  const url = `${siteUrl}/blog/${post.slug}/`;
  const ogImage = post.cover ?? '/og/default.png';

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ['hyper³labs'],
      images: [{ url: ogImage, alt: post.coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const url = `${siteUrl}/blog/${post.slug}/`;
  const absoluteCover = post.cover
    ? post.cover.startsWith('http')
      ? post.cover
      : `${siteUrl}${post.cover}`
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'hyper³labs',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'hyper³labs',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon-512.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: absoluteCover ? [absoluteCover] : undefined,
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header />
      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-20">
        <article className="prose prose-invert prose-p:text-gray-400 prose-p:leading-relaxed prose-headings:text-white prose-a:text-gray-200 prose-a:underline prose-a:decoration-gray-500/50 hover:prose-a:decoration-gray-300 hover:prose-a:text-white prose-a:transition-colors marker:text-gray-300 prose-strong:text-gray-200 max-w-none">
          <header className="mb-14 pb-8 border-b border-white/[0.08]">
            <time
              dateTime={post.date}
              className="text-gray-500 font-mono text-sm uppercase tracking-wider mb-4 block"
            >
              {formatBlogDate(post.date, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h1 className="text-3xl md:text-5xl font-semibold mt-0 mb-4 text-white leading-tight tracking-tight">
              {post.title}
            </h1>
            {post.description ? (
              <p className="text-lg text-gray-400 leading-relaxed mt-4 mb-0">
                {post.description}
              </p>
            ) : null}
          </header>

          {post.cover && post.showCover ? (
            <figure className="not-prose mb-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <Image
                src={post.cover}
                alt={post.coverAlt}
                width={2400}
                height={1200}
                priority
                className="w-full h-auto"
              />
            </figure>
          ) : null}

          <div className="prose-img:rounded-xl prose-img:border prose-img:border-white/[0.08] prose-img:bg-white/[0.02]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
