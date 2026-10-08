import { DOC_SECTIONS, type Doc } from '@/lib/docs';

type DocLink = Pick<Doc, 'slug' | 'title' | 'section'>;

export default function DocsSidebar({ docs, active }: { docs: DocLink[]; active: string }) {
  return (
    <nav aria-label="Documentation" className="space-y-7 text-sm">
      {DOC_SECTIONS.map((section) => {
        const items = docs.filter((doc) => doc.section === section);
        if (!items.length) return null;
        return (
          <div key={section}>
            <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-600">{section}</p>
            <ul className="space-y-0.5">
              {items.map((doc) => (
                <li key={doc.slug}>
                  <a
                    href={`/docs/${doc.slug}/`}
                    aria-current={doc.slug === active ? 'page' : undefined}
                    className={`block rounded-md px-3 py-1.5 transition ${
                      doc.slug === active ? 'bg-cyan-300/[0.08] text-cyan-100' : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {doc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div>
        <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-600">Explore</p>
        <a href="/examples/" className="block rounded-md px-3 py-1.5 text-gray-400 transition hover:bg-white/[0.04] hover:text-white">
          Examples gallery
        </a>
      </div>
    </nav>
  );
}
