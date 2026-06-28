'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@/components/Icons';

export default function Header() {
  const { isLoggedIn, nickname, logout } = useAuthStore();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-md border-b border-[#ececec] dark:border-[#2a2a2e]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={theme === 'dark' ? '/logo/header-dark-trans.png' : '/logo/header-light-trans.png'}
            alt="모두의 문철"
            width={160}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="flex items-center gap-7 text-[13px] font-medium text-[#6a6a70] dark:text-[#9a9aa0]">
          <Link
            href="/posts"
            className="hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
          >
            이야기 보기
          </Link>

          <button
            onClick={toggle}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
            aria-label="테마 전환"
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {isLoggedIn ? (
            <>
              <Link
                href="/posts/new"
                className="px-5 py-2 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full text-[13px] font-semibold hover:opacity-80 transition-opacity"
              >
                이야기 올리기
              </Link>
              <Link
                href="/my"
                className="hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
              >
                {nickname}
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2 border border-[#1c1c1e] dark:border-gray-400 text-[#1c1c1e] dark:text-gray-200 rounded-full font-semibold hover:bg-[#f5f5f6] dark:hover:bg-gray-800 transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
