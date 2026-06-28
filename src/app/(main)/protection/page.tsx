import PolicyLayout, { Section, Item } from '@/components/PolicyLayout';

export const metadata = { title: '보호정책 | 모두의 문철' };

export default function ProtectionPage() {
  return (
    <PolicyLayout title="보호정책" lastUpdated="2025년 1월 1일">
      <Section title="제1조 (청소년 보호)">
        <Item>
          모두의 문철은 청소년보호법에 따라 청소년이 유해 환경에 노출되지 않도록 최선을 다합니다.
        </Item>
        <Item>청소년 유해 콘텐츠가 발견될 경우 즉시 삭제 조치하며, 게시자의 계정을 제한합니다.</Item>
        <Item>청소년 보호 책임자는 운영팀이며, 문의는 dev2say@gmail.com으로 연락주시기 바랍니다.</Item>
      </Section>

      <Section title="제2조 (불법·유해 콘텐츠 차단)">
        <Item>다음에 해당하는 콘텐츠는 즉시 삭제되며 관련 계정은 이용이 제한됩니다.</Item>
        <Item>아동·청소년 성착취물, 불법 성인 콘텐츠</Item>
        <Item>폭력, 혐오, 차별을 조장하는 콘텐츠</Item>
        <Item>개인 정보 무단 유포, 사기, 허위 사실 유포</Item>
        <Item>저작권 침해 콘텐츠</Item>
      </Section>

      <Section title="제3조 (신고 및 처리 절차)">
        <Item>이용자는 문제가 되는 콘텐츠를 신고 기능을 통해 신고할 수 있습니다.</Item>
        <Item>신고된 콘텐츠는 운영팀이 검토 후 24시간 이내에 처리 결과를 안내합니다.</Item>
        <Item>운영팀의 결정에 이의가 있는 경우 dev2say@gmail.com으로 이의를 제기할 수 있습니다.</Item>
      </Section>

      <Section title="제4조 (개인정보 보호)">
        <Item>이용자의 개인정보는 개인정보처리방침에 따라 엄격히 관리됩니다.</Item>
        <Item>서비스는 법령에서 정한 경우를 제외하고 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</Item>
        <Item>데이터 침해 사고 발생 시 이용자에게 즉시 통보하고 관련 기관에 신고합니다.</Item>
      </Section>

      <Section title="제5조 (계정 보안)">
        <Item>이용자는 자신의 계정 보안에 책임이 있으며, 비밀번호를 타인과 공유해서는 안 됩니다.</Item>
        <Item>계정 도용이 의심되는 경우 즉시 운영팀에 신고하여 주시기 바랍니다.</Item>
        <Item>서비스는 비정상적인 로그인 시도가 감지될 경우 계정을 일시 잠금 처리할 수 있습니다.</Item>
      </Section>
    </PolicyLayout>
  );
}
