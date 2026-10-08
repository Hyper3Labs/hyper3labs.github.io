import type { Metadata } from 'next';
import Redirect from '@/components/Redirect';

const ARTICLE = 'https://hyper3labs.com/blog/the-geometry-mistake/';

export const metadata: Metadata = {
  title: 'The Geometry Mistake Behind Modern Embedding Models',
  alternates: { canonical: ARTICLE },
  robots: { index: false },
};

export default function MovedArticle() {
  return <Redirect to={ARTICLE} />;
}
