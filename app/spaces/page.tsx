import type { Metadata } from 'next';
import ShaderController from '@/components/ShaderController';
import Header from '@/components/Header';
import SpacesGallery from '@/components/SpacesGallery';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'HyperView Spaces',
  description:
    'Browse HyperView Static Spaces and open their runtime-connected Live Spaces.',
  alternates: {
    canonical: '/spaces/',
  },
};

export default function SpacesPage() {
  return (
    <>
      <ShaderController />
      <Header />
      <SpacesGallery />
      <Footer />
    </>
  );
}
