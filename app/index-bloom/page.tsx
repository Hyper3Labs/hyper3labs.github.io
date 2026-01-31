'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BloomConcept() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/index-resonance');
  }, [router]);

  return null;
}