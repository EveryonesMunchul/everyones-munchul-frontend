'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-[64px] font-bold text-[#ececec] dark:text-[#2a2a2e] leading-none mb-6">!</p>
      <h1 className="text-[20px] font-bold text-[#1c1c1e] dark:text-white mb-2">오류가 발생했어요</h1>
      <p className="text-[14px] text-[#9a9aa0] mb-8">일시적인 문제예요. 잠시 후 다시 시도해주세요.</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full text-[14px] font-semibold hover:opacity-80 transition-opacity"
        >
          다시 시도
        </button>
        <a
          href="/"
          className="px-6 py-2.5 border border-[#d8d8d8] dark:border-[#3a3a3e] text-[#1c1c1e] dark:text-white rounded-full text-[14px] font-semibold hover:bg-[#f5f5f7] dark:hover:bg-[#2a2a2e] transition-colors"
        >
          홈으로
        </a>
      </div>
    </div>
  );
}
