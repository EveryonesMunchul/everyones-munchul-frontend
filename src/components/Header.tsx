'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/authApi';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@/components/Icons';

export default function Header() {
  const { isLoggedIn, nickname, logout } = useAuthStore();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-md border-b border-[#ececec] dark:border-[#2a2a2e]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" onClick={close} className="flex items-center">
          <Image
            src={theme === 'dark' ? '/logo/header-dark-trans.png' : '/logo/header-light-trans.png'}
            alt="모두의 문철"
            width={160}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* 데스크탑 nav */}
        <nav className="hidden sm:flex items-center gap-7 text-[13px] font-medium text-[#6a6a70] dark:text-[#9a9aa0]">
          <Link href="/posts" className="hover:text-[#1c1c1e] dark:hover:text-white transition-colors">
            이야기 보기
          </Link>
          <button onClick={toggle} className="w-7 h-7 flex items-center justify-center rounded-full text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors" aria-label="테마 전환">
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
          {isLoggedIn ? (
            <>
              <Link href="/posts/new" className="px-5 py-2 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full text-[13px] font-semibold hover:opacity-80 transition-opacity">
                이야기 올리기
              </Link>
              <Link href="/my" className="hover:text-[#1c1c1e] dark:hover:text-white transition-colors">{nickname}</Link>
              <button onClick={handleLogout} className="hover:text-[#1c1c1e] dark:hover:text-white transition-colors">로그아웃</button>
            </>
          ) : (
            <Link href="/auth/login" className="px-5 py-2 border border-[#1c1c1e] dark:border-gray-400 text-[#1c1c1e] dark:text-gray-200 rounded-full font-semibold hover:bg-[#f5f5f6] dark:hover:bg-gray-800 transition-colors">
              로그인
            </Link>
          )}
        </nav>

        {/* 모바일 우측 버튼 */}
        <div className="flex sm:hidden items-center gap-3">
          <button onClick={toggle} className="w-8 h-8 flex items-center justify-center text-[#9a9aa0]" aria-label="테마 전환">
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
            aria-label="메뉴"
          >
            <span className={`block w-5 h-[1.5px] bg-[#1c1c1e] dark:bg-white transition-transform origin-center ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#1c1c1e] dark:bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#1c1c1e] dark:bg-white transition-transform origin-center ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#ececec] dark:border-[#2a2a2e] bg-white/95 dark:bg-[#0f1117]/95 backdrop-blur-md">
          <div className="px-4 py-4 flex flex-col gap-1 text-[15px] font-medium">
            <Link href="/posts" onClick={close} className="py-3 text-[#6a6a70] dark:text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white border-b border-[#f2f2f2] dark:border-[#1e1e22]">
              이야기 보기
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/posts/new" onClick={close} className="py-3 text-[#6a6a70] dark:text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white border-b border-[#f2f2f2] dark:border-[#1e1e22]">
                  이야기 올리기
                </Link>
                <Link href="/my" onClick={close} className="py-3 text-[#6a6a70] dark:text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white border-b border-[#f2f2f2] dark:border-[#1e1e22]">
                  {nickname}
                </Link>
                <button onClick={handleLogout} className="py-3 text-left text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white">
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={close} className="mt-2 block text-center py-3 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full font-semibold">
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
