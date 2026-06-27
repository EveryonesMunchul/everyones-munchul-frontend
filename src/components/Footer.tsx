import Link from 'next/link';

const POLICY_LINKS = [
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
  { label: '보호정책', href: '/protection' },
  { label: '이용규칙', href: '/rules' },
  { label: '공지사항', href: '/notice' },
  { label: 'FAQ', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#ececec] dark:border-[#2a2a2e] bg-[#f9f9f9] dark:bg-[#0a0a0f]">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <p className="text-[15px] font-bold text-[#1c1c1e] dark:text-white">모두의 문철</p>
            <p className="mt-1.5 text-[13px] text-[#9a9aa0] dark:text-[#6a6a70] leading-relaxed">
              사연을 올리고 모두에게 투표를 받아보세요
            </p>
            <p className="mt-3 text-[12px] text-[#c4c4c8] dark:text-[#4a4a50]">
              이메일: support@munchul.com
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-3 md:justify-end">
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-[#6a6a70] dark:text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[#ececec] dark:border-[#2a2a2e] flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-[12px] text-[#c4c4c8] dark:text-[#4a4a50]">
            © 2025 모두의 문철. All rights reserved.
          </p>
          <p className="text-[12px] text-[#c4c4c8] dark:text-[#4a4a50]">
            사업자등록번호: 000-00-00000 &nbsp;|&nbsp; 대표: 홍길동
          </p>
        </div>
      </div>
    </footer>
  );
}
