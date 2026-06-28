import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: '모두의 문철',
  description: '이야기를 올리고 모두에게 투표를 받아보세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0f1117] transition-colors">
        <ThemeProvider>
          <Header />
          <main className="max-w-[1200px] mx-auto px-6 py-8">{children}</main>
          <Footer />
          <Toast />
        </ThemeProvider>
      </body>
    </html>
  );
}
