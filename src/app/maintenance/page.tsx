import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MiniGame from './MiniGame';

export const metadata: Metadata = { title: '서비스 점검 중 | 모두의 문철' };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

async function getMaintenance() {
  try {
    const res = await fetch(`${API_URL}/api/maintenance`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', {
    month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function MaintenancePage() {
  const data = await getMaintenance();

  if (!data?.currentlyActive) redirect('/');

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#f5f5f7] dark:bg-[#111115]">

      {/* 점검 안내 — 상단 compact */}
      <div className="flex-none px-5 pt-8 pb-4 flex flex-col items-center gap-1.5 text-center">
        <div className="w-9 h-9 rounded-xl bg-[#1c1c1e] dark:bg-white flex items-center justify-center mb-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              stroke="white"
              className="dark:stroke-[#1c1c1e]"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-[18px] font-bold text-[#1c1c1e] dark:text-white tracking-tight">
          서비스 점검 중입니다
        </h1>

        {data?.message ? (
          <p className="text-[13px] text-[#6a6a70] dark:text-[#9a9aa0] leading-relaxed whitespace-pre-line max-w-[320px]">
            {data.message}
          </p>
        ) : (
          <p className="text-[13px] text-[#9a9aa0]">
            더 나은 서비스를 위해 잠시 점검 중이에요.
          </p>
        )}

        {(data?.startAt || data?.endAt) && (
          <div className="flex items-center gap-4 mt-1 text-[12px]">
            {data.startAt && (
              <span className="text-[#9a9aa0]">
                시작 <span className="text-[#1c1c1e] dark:text-white font-medium">{fmt(data.startAt)}</span>
              </span>
            )}
            {data.startAt && data.endAt && <span className="text-[#d4d4d8]">·</span>}
            {data.endAt && (
              <span className="text-[#9a9aa0]">
                종료 예정 <span className="text-[#1c1c1e] dark:text-white font-medium">{fmt(data.endAt)}</span>
              </span>
            )}
          </div>
        )}

        <p className="text-[11px] text-[#c4c4c8] dark:text-[#4a4a50] mt-0.5">
          점검 완료 후 정상 이용 가능합니다
        </p>
      </div>

      {/* 게임 — 나머지 공간 전체 */}
      <div className="flex-1 flex flex-col items-center min-h-0 justify-center">
        <div className="w-full sm:max-w-[660px]">
          <p className="text-[11px] font-semibold text-[#c4c4c8] tracking-widest uppercase mb-2 text-center">
            점검 중 미니게임
          </p>
          <MiniGame />
          <p className="text-[11px] text-[#c4c4c8] text-center py-2">
            방향키 / WASD · 모바일 스와이프
          </p>
        </div>
      </div>

    </div>
  );
}
