import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: '모두의 문철',
  description: '사연을 올리고 모두에게 투표를 받아보세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors">
        <ThemeProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
