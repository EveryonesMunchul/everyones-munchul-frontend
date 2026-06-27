import PolicyLayout, { Section, Item } from '@/components/PolicyLayout';

export const metadata = { title: '개인정보처리방침 | 모두의 문철' };

export default function PrivacyPage() {
  return (
    <PolicyLayout title="개인정보처리방침" lastUpdated="2025년 1월 1일">
      <Section title="제1조 (수집하는 개인정보 항목)">
        <Item>모두의 문철은 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</Item>
        <Item>필수 항목: 이메일 주소, 닉네임, 소셜 로그인 식별자(OAuth ID)</Item>
        <Item>자동 수집 항목: 서비스 이용 기록, 접속 IP, 쿠키, 기기 정보</Item>
      </Section>

      <Section title="제2조 (개인정보 수집 및 이용 목적)">
        <Item>회원 식별 및 서비스 제공</Item>
        <Item>사연 게시, 투표, 댓글 등 서비스 기능 제공</Item>
        <Item>부정 이용 방지 및 이용 제한 조치</Item>
        <Item>서비스 개선 및 신규 기능 개발을 위한 통계 분석</Item>
        <Item>공지사항 및 서비스 관련 안내 발송</Item>
      </Section>

      <Section title="제3조 (개인정보 보유 및 이용기간)">
        <Item>회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.</Item>
        <Item>단, 관련 법령에 따라 아래 정보는 일정 기간 보관됩니다.</Item>
        <Item>전자상거래 등에서 소비자 보호에 관한 법률: 계약·청약철회 기록 5년, 대금결제·재화공급 기록 5년, 소비자 불만·분쟁처리 기록 3년</Item>
        <Item>통신비밀보호법: 로그인 기록 3개월</Item>
      </Section>

      <Section title="제4조 (개인정보의 제3자 제공)">
        <Item>모두의 문철은 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.</Item>
        <Item>다만, 이용자의 사전 동의가 있거나 법령에 근거한 경우에는 예외로 합니다.</Item>
      </Section>

      <Section title="제5조 (이용자의 권리)">
        <Item>이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있습니다.</Item>
        <Item>회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.</Item>
        <Item>개인정보 처리에 관한 문의는 support@munchul.com으로 연락주시기 바랍니다.</Item>
      </Section>

      <Section title="제6조 (개인정보 보호책임자)">
        <Item>책임자: 모두의 문철 운영팀</Item>
        <Item>이메일: support@munchul.com</Item>
      </Section>
    </PolicyLayout>
  );
}
