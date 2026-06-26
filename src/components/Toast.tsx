'use client';

import { useToastStore } from '@/store/toastStore';

const TYPE_STYLE = {
  error:   'bg-[#ff3b30] text-white',
  success: 'bg-[#34c759] text-white',
  info:    'bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e]',
};

export default function Toast() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg text-[14px] font-medium max-w-sm text-center animate-in fade-in slide-in-from-bottom-2 duration-200 ${TYPE_STYLE[t.type]}`}
        >
          <span>{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="opacity-70 hover:opacity-100 transition-opacity text-[18px] leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
