import PolicyLayout, { Section, Item } from '@/components/PolicyLayout';

export const metadata = { title: '이용규칙 | 모두의 문철' };

export default function RulesPage() {
  return (
    <PolicyLayout title="이용규칙" lastUpdated="2025년 1월 1일">
      <Section title="제1조 (커뮤니티 가이드라인)">
        <Item>모두의 문철은 누구나 편하게 이야기할 수 있는 건강한 커뮤니티를 지향합니다.</Item>
        <Item>다른 이용자를 존중하고 배려하는 방식으로 서비스를 이용해 주세요.</Item>
        <Item>진실된 경험과 의견을 공유하고, 허위 사실을 게시하지 마세요.</Item>
      </Section>

      <Section title="제2조 (금지 행위)">
        <Item>타인을 비방하거나 명예를 훼손하는 게시물 작성</Item>
        <Item>욕설, 혐오 표현, 차별적 언어 사용</Item>
        <Item>도배, 광고, 스팸성 게시물 반복 작성</Item>
        <Item>타인의 개인정보 무단 수집 및 유포</Item>
        <Item>성적 수치심을 유발하는 콘텐츠 게시</Item>
        <Item>서비스 운영을 방해하는 행위 (크롤링, DDoS 등)</Item>
        <Item>다중 계정을 이용한 투표 조작 또는 어뷰징</Item>
        <Item>타인을 사칭하거나 허위 정보로 계정 생성</Item>
      </Section>

      <Section title="제3조 (게시물 작성 규칙)">
        <Item>사연은 실제 경험을 바탕으로 작성해 주세요.</Item>
        <Item>제목과 내용이 일치해야 하며, 낚시성 제목은 제재 대상입니다.</Item>
        <Item>동일한 내용의 게시물을 반복 작성하는 것은 금지됩니다.</Item>
        <Item>외부 링크 첨부 시 안전하고 신뢰할 수 있는 링크만 사용해 주세요.</Item>
      </Section>

      <Section title="제4조 (제재 기준)">
        <Item>경고 1회: 위반 콘텐츠 삭제 및 경고 메시지 발송</Item>
        <Item>경고 3회 누적: 7일 이용 정지</Item>
        <Item>경고 5회 누적 또는 중대 위반: 영구 이용 정지</Item>
        <Item>불법 콘텐츠 게시 등 심각한 위반 행위는 즉시 영구 이용 정지 처리됩니다.</Item>
      </Section>

      <Section title="제5조 (이의 신청)">
        <Item>제재 결정에 이의가 있는 경우 support@munchul.com으로 이의를 제기할 수 있습니다.</Item>
        <Item>이의 신청은 제재 조치 후 7일 이내에 가능합니다.</Item>
        <Item>운영팀은 이의 신청 접수 후 3영업일 이내에 검토 결과를 안내합니다.</Item>
      </Section>
    </PolicyLayout>
  );
}
