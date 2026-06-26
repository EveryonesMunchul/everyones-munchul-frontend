import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-[64px] font-bold text-[#ececec] dark:text-[#2a2a2e] leading-none mb-6">404</p>
      <h1 className="text-[20px] font-bold text-[#1c1c1e] dark:text-white mb-2">페이지를 찾을 수 없어요</h1>
      <p className="text-[14px] text-[#9a9aa0] mb-8">주소가 잘못됐거나 삭제된 페이지예요.</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full text-[14px] font-semibold hover:opacity-80 transition-opacity"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
