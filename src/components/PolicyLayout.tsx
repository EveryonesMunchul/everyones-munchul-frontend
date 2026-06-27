import { ReactNode } from 'react';

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="max-w-[780px] mx-auto py-4">
      <h1 className="text-[26px] font-bold text-[#1c1c1e] dark:text-white">{title}</h1>
      <p className="mt-2 text-[13px] text-[#9a9aa0] dark:text-[#6a6a70]">최종 수정일: {lastUpdated}</p>
      <hr className="my-6 border-[#ececec] dark:border-[#2a2a2e]" />
      <div className="prose-policy space-y-8 text-[14px] leading-[1.85] text-[#3a3a3c] dark:text-[#c0c0c5]">
        {children}
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[16px] font-semibold text-[#1c1c1e] dark:text-white mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export function Item({ children }: { children: ReactNode }) {
  return (
    <p className="pl-3 border-l-2 border-[#ececec] dark:border-[#2a2a2e]">{children}</p>
  );
}
