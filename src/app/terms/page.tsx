import PolicyLayout, { Section, Item } from '@/components/PolicyLayout';

export const metadata = { title: '이용약관 | 모두의 문철' };

export default function TermsPage() {
  return (
    <PolicyLayout title="이용약관" lastUpdated="2025년 1월 1일">
      <Section title="제1조 (목적)">
        <Item>
          본 약관은 모두의 문철(이하 "서비스")이 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와
          서비스 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Item>
      </Section>

      <Section title="제2조 (정의)">
        <Item>"서비스"란 모두의 문철이 운영하는 웹사이트 및 관련 서비스 일체를 말합니다.</Item>
        <Item>"이용자"란 본 약관에 따라 서비스를 이용하는 모든 회원 및 비회원을 말합니다.</Item>
        <Item>"회원"이란 서비스에 가입하여 계정을 보유한 이용자를 말합니다.</Item>
        <Item>"사연"이란 이용자가 서비스에 게시한 글, 이미지, 투표 등의 콘텐츠를 말합니다.</Item>
      </Section>

      <Section title="제3조 (약관의 효력 및 변경)">
        <Item>본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</Item>
        <Item>서비스는 합리적인 사유가 있을 경우 약관을 변경할 수 있으며, 변경 시 공지사항을 통해 안내합니다.</Item>
        <Item>변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</Item>
      </Section>

      <Section title="제4조 (서비스 이용)">
        <Item>서비스는 연중무휴 24시간 제공을 원칙으로 합니다.</Item>
        <Item>시스템 점검, 장애, 기타 사유로 서비스가 일시 중단될 수 있습니다.</Item>
        <Item>서비스는 서비스 내용을 변경하거나 종료할 수 있으며, 사전에 공지합니다.</Item>
      </Section>

      <Section title="제5조 (이용자의 의무)">
        <Item>이용자는 타인의 개인정보를 무단으로 수집·이용하거나 허위 정보를 등록해서는 안 됩니다.</Item>
        <Item>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</Item>
        <Item>타인의 명예를 훼손하거나 불이익을 주는 행위를 해서는 안 됩니다.</Item>
        <Item>관련 법령 및 본 약관을 준수해야 합니다.</Item>
      </Section>

      <Section title="제6조 (저작권)">
        <Item>이용자가 서비스에 게시한 콘텐츠의 저작권은 해당 이용자에게 있습니다.</Item>
        <Item>이용자는 서비스 내 게시를 위해 서비스에 콘텐츠 사용 권한을 부여합니다.</Item>
        <Item>서비스가 제공하는 UI, 디자인, 로고 등의 저작권은 모두의 문철에 있습니다.</Item>
      </Section>

      <Section title="제7조 (면책조항)">
        <Item>서비스는 이용자 간 분쟁에 개입하지 않으며, 이로 인한 손해를 배상할 책임이 없습니다.</Item>
        <Item>서비스는 이용자가 게시한 콘텐츠의 정확성·신뢰성에 대해 보증하지 않습니다.</Item>
      </Section>
    </PolicyLayout>
  );
}
