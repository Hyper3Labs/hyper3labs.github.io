import { DOC_SECTIONS, docHref, type Doc } from '@/lib/docs';
import { SPACES_URL, type Project } from '@/lib/projects';

type DocLink = Pick<Doc, 'project' | 'slug' | 'title' | 'section'>;

export default function DocsSidebar({ project, docs, active }: { project: Project; docs: DocLink[]; active: string }) {
  const linkClass = 'block rounded-md px-3 py-1.5 text-gray-400 transition hover:bg-white/[0.04] hover:text-white';
  return (
    <nav aria-label={`${project.name} documentation`} className="space-y-7 text-sm">
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
                    href={docHref(doc)}
                    aria-current={doc.slug === active ? 'page' : undefined}
                    className={
                      doc.slug === active
                        ? 'block rounded-md bg-cyan-300/[0.08] px-3 py-1.5 text-cyan-100'
                        : linkClass
                    }
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
        <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-600">Links</p>
        <a href={project.repo} className={linkClass}>GitHub</a>
        <a href={project.registry.href} className={linkClass}>{project.registry.label}</a>
        {project.id === 'hyperview' ? <a href={SPACES_URL} className={linkClass}>Spaces gallery</a> : null}
      </div>
    </nav>
  );
}
