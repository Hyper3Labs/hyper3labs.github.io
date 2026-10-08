import type { Metadata } from 'next';
import Redirect from '@/components/Redirect';

export const metadata: Metadata = { title: 'Docs', robots: { index: false } };

export default function DocsIndex() {
  return <Redirect to="/docs/installation/" />;
}
