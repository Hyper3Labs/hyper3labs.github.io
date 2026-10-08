import type { Metadata } from 'next';
import Redirect from '@/components/Redirect';

export const metadata: Metadata = {
  title: 'Examples',
  alternates: { canonical: '/examples/' },
  robots: { index: false },
};

/** The gallery moved to /examples/. Individual Spaces stay at /spaces/<slug>/. */
export default function SpacesIndex() {
  return <Redirect to="/examples/" />;
}
