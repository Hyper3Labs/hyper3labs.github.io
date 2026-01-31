import ShaderController from '@/components/ShaderController';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhyGeometry from '@/components/WhyGeometry';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <ShaderController />
      <Header />
      <main className="relative z-10 min-h-screen">
        <Hero />
        <WhyGeometry />
        <Projects />
        <Footer />
      </main>
    </>
  );
}
