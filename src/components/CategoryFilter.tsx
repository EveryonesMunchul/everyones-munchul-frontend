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
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const label = cat === ALL ? ALL : CATEGORY_LABELS[cat];
        const active = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition
              ${active
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
