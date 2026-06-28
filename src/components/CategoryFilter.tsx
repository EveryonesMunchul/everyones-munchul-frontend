'use client';

import { CATEGORY_LABELS } from '@/types';

interface Props {
  selected: string;
  onChange: (category: string) => void;
}

const ALL = '전체';

export default function CategoryFilter({ selected, onChange }: Props) {
  const categories = [ALL, ...Object.keys(CATEGORY_LABELS)];

  return (
    <div className="flex gap-5 sm:gap-6 overflow-x-auto border-b border-[#ececec] dark:border-[#2a2a2e] pb-4 mb-1 scrollbar-hide">
      {categories.map((cat) => {
        const label = cat === ALL ? ALL : CATEGORY_LABELS[cat];
        const active = selected === cat;
        return (
          <button
            key={cat}
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
  );
}
