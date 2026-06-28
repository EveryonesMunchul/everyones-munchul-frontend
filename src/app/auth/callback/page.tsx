'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function OAuthCallbackHandler() {
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    // 토큰은 해시 프래그먼트(#)로 전달됨 — 서버 로그에 기록되지 않음
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const userId = params.get('userId');
    const nickname = params.get('nickname');
    const role = params.get('role');

    if (!accessToken || !refreshToken || !userId || !nickname || !role) {
      router.replace('/auth/login');
      return;
    }

    login({
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      userId: Number(userId),
      nickname,
      role,
    });

    router.replace('/');
  }, [login, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <p className="text-[14px] text-[#9a9aa0]">로그인 처리 중...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-[14px] text-[#9a9aa0]">로그인 처리 중...</p>
      </div>
    }>
      <OAuthCallbackHandler />
    </Suspense>
  );
}
