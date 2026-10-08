'use client';

import { useEffect } from 'react';

/** Static-export redirect: GitHub Pages cannot send HTTP redirects. */
export default function Redirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to + window.location.hash);
  }, [to]);

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-gray-400">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      This page has moved to <a href={to} className="text-white underline">{to}</a>.
    </main>
  );
}
