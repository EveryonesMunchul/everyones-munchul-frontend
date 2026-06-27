import { Metadata } from 'next';
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] dark:bg-[#111115] px-6 py-16 gap-10">

      {/* 미니게임 */}
      <div className="w-full max-w-[680px]">
        <p className="text-[11px] font-semibold text-[#c4c4c8] tracking-widest uppercase mb-3 text-center">
          점검 중 미니게임
        </p>
        <MiniGame />
        <p className="text-[11px] text-[#c4c4c8] text-center mt-2">
          방향키 / WASD · 모바일 스와이프
        </p>
      </div>

      {/* 점검 안내 */}
      <div className="text-center max-w-[400px] w-full">
        <div className="flex justify-center mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#1c1c1e] dark:bg-white flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
        </div>

        <h1 className="text-[22px] font-bold text-[#1c1c1e] dark:text-white tracking-tight">
          서비스 점검 중입니다
        </h1>

        {data?.message ? (
          <p className="mt-3 text-[14px] text-[#6a6a70] dark:text-[#9a9aa0] leading-relaxed whitespace-pre-line">
            {data.message}
          </p>
        ) : (
          <p className="mt-3 text-[14px] text-[#9a9aa0] dark:text-[#6a6a70]">
            더 나은 서비스를 위해 잠시 점검 중이에요.
          </p>
        )}

        {(data?.startAt || data?.endAt) && (
          <div className="mt-5 inline-flex flex-col gap-2 bg-white dark:bg-[#1c1c1e] border border-[#ececec] dark:border-[#2a2a2e] rounded-2xl px-6 py-4 text-left">
            {data.startAt && (
              <div className="flex items-center gap-3 text-[13px]">
                <span className="text-[#c4c4c8]">시작</span>
                <span className="text-[#1c1c1e] dark:text-white font-medium">{fmt(data.startAt)}</span>
              </div>
            )}
            {data.endAt && (
              <div className="flex items-center gap-3 text-[13px]">
                <span className="text-[#c4c4c8]">종료 예정</span>
                <span className="text-[#1c1c1e] dark:text-white font-medium">{fmt(data.endAt)}</span>
              </div>
            )}
          </div>
        )}

        <p className="mt-7 text-[12px] text-[#c4c4c8] dark:text-[#4a4a50]">
          점검이 완료되면 정상적으로 이용하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
