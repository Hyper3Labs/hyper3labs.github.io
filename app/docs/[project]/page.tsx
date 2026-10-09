import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Redirect from '@/components/Redirect';
import { docHref, getProjectDocs } from '@/lib/docs';
import { PROJECTS } from '@/lib/projects';

export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ project: project.id }));
}

// /docs/<project>/ opens the project's first page.
export default function ProjectIndex({ params }: { params: { project: string } }) {
  const first = getProjectDocs(params.project)[0];
  if (!first) notFound();
  return <Redirect to={docHref(first)} />;
}
