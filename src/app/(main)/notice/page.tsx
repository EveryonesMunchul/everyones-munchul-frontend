import { Metadata } from 'next';

export const metadata: Metadata = { title: '공지사항 | 모두의 문철' };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

async function getNotices(): Promise<Notice[]> {
  try {
    const res = await fetch(`${API_URL}/api/notices`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function NoticePage() {
  const notices = await getNotices();

  return (
    <div className="max-w-[780px] mx-auto py-4">
      <h1 className="text-[26px] font-bold text-[#1c1c1e] dark:text-white">공지사항</h1>
      <p className="mt-2 text-[13px] text-[#9a9aa0] dark:text-[#6a6a70]">
        서비스의 중요한 소식을 안내해 드립니다.
      </p>
      <hr className="my-6 border-[#ececec] dark:border-[#2a2a2e]" />

      <ul className="space-y-0 divide-y divide-[#ececec] dark:divide-[#2a2a2e]">
        {notices.map((notice) => (
          <li key={notice.id} className="py-5">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-[15px] font-semibold text-[#1c1c1e] dark:text-white">
                {notice.title}
              </span>
              <span className="shrink-0 text-[12px] text-[#9a9aa0] dark:text-[#6a6a70]">
                {new Date(notice.createdAt + 'Z').toLocaleDateString('ko-KR', {
                  year: 'numeric', month: '2-digit', day: '2-digit',
                }).replace(/\.\s*/g, '.').replace(/\.$/, '')}
              </span>
            </div>
            <p className="text-[13px] text-[#6a6a70] dark:text-[#9a9aa0] leading-relaxed whitespace-pre-line">
              {notice.content}
            </p>
          </li>
        ))}
      </ul>

      {notices.length === 0 && (
        <p className="py-16 text-center text-[14px] text-[#9a9aa0] dark:text-[#6a6a70]">
          등록된 공지사항이 없습니다.
        </p>
      )}
    </div>
  );
}
