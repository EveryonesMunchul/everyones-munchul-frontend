'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function OAuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');
    const nickname = searchParams.get('nickname');
    const role = searchParams.get('role');

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
  }, [searchParams, login, router]);

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
