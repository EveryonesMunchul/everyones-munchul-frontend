'use client';

import { useEffect, useRef } from 'react';
import { CATEGORY_LABELS } from '@/types';

interface Props {
  selected: string;
  onChange: (category: string) => void;
}

const ALL = '전체';

export default function CategoryFilter({ selected, onChange }: Props) {
  const categories = [ALL, ...Object.keys(CATEGORY_LABELS)];
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // 선택된 카테고리가 항상 보이도록 스크롤
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [selected]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto border-b border-[#ececec] dark:border-[#2a2a2e] pb-4 mb-1 scrollbar-hide"
      >
        {categories.map((cat) => {
          const label = cat === ALL ? ALL : CATEGORY_LABELS[cat];
          const active = selected === cat;
          return (
            <button
              key={cat}
              ref={active ? activeRef : undefined}
              onClick={() => onChange(cat)}
              className={`shrink-0 text-[14px] font-medium pb-1 transition-colors border-b-2 -mb-[17px]
                ${active
                  ? 'text-[#1c1c1e] dark:text-white border-[#1c1c1e] dark:border-white font-semibold'
                  : 'text-[#9a9aa0] dark:text-[#6a6a70] border-transparent hover:text-[#1c1c1e] dark:hover:text-white'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 우측 페이드 — 더 스크롤 가능하다는 힌트 (모바일 전용) */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white dark:from-[#0f1117] to-transparent sm:hidden" />
    </div>
  );
}
