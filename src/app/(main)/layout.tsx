import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      <Footer />
      <Toast />
    </>
  );
}
