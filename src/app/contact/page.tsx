import { Metadata } from 'next';

export const metadata: Metadata = { title: 'FAQ | 모두의 문철' };

const FAQ = [
  {
    q: '사연은 누구나 올릴 수 있나요?',
    a: '회원 가입 후 로그인한 사용자라면 누구나 사연을 올릴 수 있습니다.',
  },
  {
    q: '투표는 몇 번까지 할 수 있나요?',
    a: '한 게시물에 1인 1회만 투표할 수 있으며, 투표 후에는 변경이 불가능합니다.',
  },
  {
    q: '게시물을 삭제하고 싶어요.',
    a: '본인이 작성한 게시물은 게시물 상세 페이지에서 삭제할 수 있습니다. 단, 타인의 투표가 진행 중인 게시물은 삭제가 제한될 수 있습니다.',
  },
  {
    q: '닉네임은 어떻게 변경하나요?',
    a: '마이페이지 > 내 정보 탭에서 닉네임 변경 버튼을 통해 변경할 수 있습니다.',
  },
  {
    q: '신고한 게시물은 언제 처리되나요?',
    a: '신고 접수 후 운영팀에서 24시간 이내에 검토하여 처리합니다.',
  },
  {
    q: '등급은 어떻게 올라가나요?',
    a: '투표 참여, 사연 게시 등 서비스 활동을 통해 경험치(XP)가 쌓이며, 일정 XP 달성 시 등급이 상승합니다. 현재 등급과 경험치는 마이페이지 > 활동 통계에서 확인할 수 있습니다.',
  },
  {
    q: '계정이 정지되었는데 이의를 제기하고 싶어요.',
    a: '마이페이지 > 문의하기 탭을 통해 이의 신청을 제출할 수 있습니다. 제재 조치 후 7일 이내에 신청해 주세요.',
  },
  {
    q: '소셜 로그인 계정의 이메일을 변경하고 싶어요.',
    a: '소셜 로그인(구글·카카오·네이버)의 이메일은 각 플랫폼 계정 설정에서 변경해야 하며, 서비스 내에서는 직접 변경이 불가능합니다.',
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-[780px] mx-auto py-4">
      <h1 className="text-[26px] font-bold text-[#1c1c1e] dark:text-white">FAQ</h1>
      <p className="mt-2 text-[13px] text-[#9a9aa0] dark:text-[#6a6a70]">
        자주 묻는 질문을 확인해 보세요. 추가 문의는 마이페이지에서 보내실 수 있습니다.
      </p>
      <hr className="my-6 border-[#ececec] dark:border-[#2a2a2e]" />

      <ul className="space-y-0 divide-y divide-[#ececec] dark:divide-[#2a2a2e]">
        {FAQ.map((item, i) => (
          <li key={i} className="py-5">
            <p className="text-[14px] font-semibold text-[#1c1c1e] dark:text-white mb-2">
              Q. {item.q}
            </p>
            <p className="text-[13px] text-[#6a6a70] dark:text-[#9a9aa0] leading-relaxed pl-4">
              {item.a}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
