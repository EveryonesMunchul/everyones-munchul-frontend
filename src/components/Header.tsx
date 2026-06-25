'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';
import { useTheme } from './ThemeProvider';

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
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1a1d27] border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          모두의 문철
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/posts" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            사연 보기
          </Link>

          {/* 다크모드 토글 */}
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isLoggedIn ? (
            <>
              <Link href="/posts/new">
                <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                  사연 올리기
                </button>
              </Link>
              <span className="text-gray-500 dark:text-gray-400">{nickname}</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                로그인
              </Link>
              <Link href="/auth/signup">
                <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition">
                  회원가입
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
