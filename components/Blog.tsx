import Image from 'next/image';
import Link from 'next/link';
import { formatBlogDate, getAllPosts } from '@/lib/blog';

export default function Blog() {
  const posts = getAllPosts();

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="relative py-20 px-6 bg-black/40">
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Notes & Research
          </h2>
          <p className="text-gray-400 text-sm max-w-xl">
            Thoughts on geometries, scaling laws, and next generation architectures.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="
                group flex flex-col overflow-hidden rounded-2xl
                bg-white/[0.02] backdrop-blur-md
                border border-white/[0.05]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                hover:border-white/[0.12] hover:bg-white/[0.04]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]
                transition-all duration-500 hover:-translate-y-1
              "
            >
              {/* Cover image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-b border-white/[0.05]">
                {post.cover ? (
                  <Image
                    src={post.cover}
                    alt={post.coverAlt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-mono text-xs uppercase tracking-widest">
                    hyper³labs
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3 text-xs font-mono text-gray-500 uppercase tracking-wider">
                  <span>Notes</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.date}>
                    {formatBlogDate(post.date, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <h3 className="text-xl font-semibold text-gray-100 group-hover:text-white transition-colors leading-snug mb-3">
                  {post.title}
                </h3>
                {post.description ? (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                ) : null}

                <div className="mt-auto pt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors">
                  <span className="font-mono">read post</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
