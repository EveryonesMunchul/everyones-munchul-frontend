'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { userApi, MyProfile, MyStats, MyVotedPost, UserGrade, AdminMessage } from '@/lib/userApi';
import { extractErrorMessage } from '@/lib/errorUtils';

type Tab = 'profile' | 'stats' | 'votes' | 'contact';

const GRADE_LABEL: Record<UserGrade, string> = {
  BRONZE: '브론즈', SILVER: '실버', GOLD: '골드',
  PLATINUM: '플래티넘', DIAMOND: '다이아몬드', MASTER: '마스터',
};

const GRADE_COLOR: Record<UserGrade, string> = {
  BRONZE: 'text-amber-700 bg-amber-50 border-amber-200',
  SILVER: 'text-slate-500 bg-slate-50 border-slate-200',
  GOLD: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  PLATINUM: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  DIAMOND: 'text-blue-600 bg-blue-50 border-blue-200',
  MASTER: 'text-purple-600 bg-purple-50 border-purple-200',
};

const PROVIDER_LABEL: Record<string, string> = {
  GOOGLE: '구글', KAKAO: '카카오', NAVER: '네이버',
};

export default function MyPage() {
  const router = useRouter();
  const { isLoggedIn, nickname: storeNickname, login } = useAuthStore();
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [stats, setStats] = useState<MyStats | null>(null);
  const [votes, setVotes] = useState<MyVotedPost[]>([]);
  const [votesPage, setVotesPage] = useState(0);
  const [votesTotalPages, setVotesTotalPages] = useState(0);

  const [adminMessages, setAdminMessages] = useState<AdminMessage[] | null>(null);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const [profileError, setProfileError] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameEditing, setNicknameEditing] = useState(false);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  const [contactSubject, setContactSubject] = useState('');
  const [contactBody, setContactBody] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactDone, setContactDone] = useState(false);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) { router.replace('/auth/login'); return; }
    userApi.getProfile()
      .then(r => {
        setProfile(r.data);
        setNicknameInput(r.data.nickname);
      })
      .catch((e) => {
        const status = e?.response?.status;
        // 401은 api.ts 인터셉터가 forceLogout 처리. 403도 인증 문제로 간주
        if (status === 403) {
          router.replace('/auth/login');
        } else {
          setProfileError('프로필을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
        }
      });
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (tab === 'stats' && !stats) {
      userApi.getStats().then(r => setStats(r.data)).catch(() => {});
      if (adminMessages === null) {
        userApi.getAdminMessages().then(r => setAdminMessages(r.data)).catch(() => setAdminMessages([]));
      }
    }
    if (tab === 'votes' && votes.length === 0) {
      loadVotes(0);
    }
  }, [tab]);

  const loadVotes = useCallback((page: number) => {
    userApi.getVotedPosts(page).then(r => {
      setVotes(r.data.content);
      setVotesPage(r.data.number);
      setVotesTotalPages(r.data.totalPages);
    }).catch(() => {});
  }, []);

  const handleNicknameSave = async () => {
    setNicknameError('');
    setNicknameLoading(true);
    try {
      const { data } = await userApi.changeNickname(nicknameInput.trim());
      setProfile(data);
      setNicknameEditing(false);
      const store = useAuthStore.getState();
      useAuthStore.setState({ ...store, nickname: data.nickname });
    } catch (e) {
      setNicknameError(extractErrorMessage(e));
    } finally {
      setNicknameLoading(false);
    }
  };

  const CONTACT_COOLDOWN_MS = 60_000;

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');

    const lastSent = localStorage.getItem('lastContactAt');
    const elapsed = lastSent ? Date.now() - Number(lastSent) : Infinity;
    if (elapsed < CONTACT_COOLDOWN_MS) {
      setContactError(`${Math.ceil((CONTACT_COOLDOWN_MS - elapsed) / 1000)}초 후에 다시 보낼 수 있습니다`);
      return;
    }

    setContactLoading(true);
    try {
      await userApi.sendContact(contactSubject, contactBody);
      localStorage.setItem('lastContactAt', String(Date.now()));
      setContactDone(true);
      setContactSubject('');
      setContactBody('');
    } catch (e) {
      setContactError(extractErrorMessage(e));
    } finally {
      setContactLoading(false);
    }
  };

  if (profileError) {
    return <div className="min-h-[60vh] flex items-center justify-center text-[14px] text-red-400">{profileError}</div>;
  }

  if (!profile) {
    return <div className="min-h-[60vh] flex items-center justify-center text-[14px] text-[#9a9aa0]">불러오는 중...</div>;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: '내 정보' },
    { key: 'stats', label: '활동 통계' },
    { key: 'votes', label: '투표 내역' },
    { key: 'contact', label: '문의하기' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-[#f0f0f5] dark:bg-[#2a2a2e] flex items-center justify-center text-[22px] font-bold text-[#5658d6]">
          {profile.nickname[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#1c1c1e] dark:text-white">{profile.nickname}</h1>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${GRADE_COLOR[profile.grade]}`}>
              {GRADE_LABEL[profile.grade]}
            </span>
          </div>
          <p className="text-[13px] text-[#9a9aa0] mt-0.5">{profile.email}</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 mb-6 border-b border-[#ececec] dark:border-[#2a2a2e]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'border-[#5658d6] text-[#5658d6]'
                : 'border-transparent text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 내 정보 탭 */}
      {tab === 'profile' && (
        <div className="space-y-4">
          <InfoCard label="이메일" value={profile.email} />
          <InfoCard label="로그인 방법" value={profile.provider ? `${PROVIDER_LABEL[profile.provider]} 로그인` : '이메일'} />
          <InfoCard label="가입일" value={new Date(profile.joinedAt).toLocaleDateString('ko-KR')} />

          {/* 닉네임 변경 */}
          <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-[#ececec] dark:border-[#2a2a2e] rounded-2xl">
            <p className="text-[12px] text-[#9a9aa0] mb-1.5">닉네임</p>
            {nicknameEditing ? (
              <div className="flex gap-2">
                <input
                  value={nicknameInput}
                  onChange={e => setNicknameInput(e.target.value)}
                  maxLength={30}
                  className="flex-1 px-3 py-2 border border-[#d8d8d8] dark:border-[#3a3a3e] bg-[#f8f8fa] dark:bg-[#0f1117] rounded-xl text-[14px] text-[#1c1c1e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5658d6]"
                />
                <button
                  onClick={handleNicknameSave}
                  disabled={nicknameLoading}
                  className="px-4 py-2 bg-[#5658d6] text-white rounded-xl text-[13px] font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                  저장
                </button>
                <button
                  onClick={() => { setNicknameEditing(false); setNicknameInput(profile.nickname); setNicknameError(''); }}
                  className="px-4 py-2 border border-[#ececec] dark:border-[#2a2a2e] text-[#9a9aa0] rounded-xl text-[13px] hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-[#1c1c1e] dark:text-white">{profile.nickname}</span>
                <button
                  onClick={() => setNicknameEditing(true)}
                  className="text-[13px] text-[#5658d6] hover:underline"
                >
                  변경
                </button>
              </div>
            )}
            {nicknameError && <p className="mt-1.5 text-[12px] text-red-500">{nicknameError}</p>}
          </div>
        </div>
      )}

      {/* 활동 통계 탭 */}
      {tab === 'stats' && (
        <div className="space-y-4">
          {stats ? (
            <>
              {/* 경험치 바 */}
              <div className="p-5 bg-white dark:bg-[#1c1c1e] border border-[#ececec] dark:border-[#2a2a2e] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[13px] px-2.5 py-0.5 rounded-full border font-semibold ${GRADE_COLOR[stats.grade]}`}>
                    {GRADE_LABEL[stats.grade]}
                  </span>
                  <span className="text-[13px] text-[#9a9aa0]">
                    {stats.exp.toLocaleString()} XP
                    {stats.expForNextGrade > 0 && ` / ${stats.expForNextGrade.toLocaleString()} XP`}
                  </span>
                </div>
                {stats.expForNextGrade > 0 && (
                  <div className="h-2 bg-[#f0f0f5] dark:bg-[#2a2a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5658d6] rounded-full transition-all"
                      style={{ width: `${Math.min(100, (stats.exp / stats.expForNextGrade) * 100)}%` }}
                    />
                  </div>
                )}
                {stats.expForNextGrade === -1 && (
                  <p className="text-[13px] text-[#9a9aa0] mt-2">최고 등급에 도달했습니다!</p>
                )}
              </div>

              {/* 투표 통계 */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="총 투표" value={stats.totalVotes.toString()} unit="회" />
                <StatCard label="다수결 일치" value={stats.correctPredictions.toString()} unit="회" />
                <StatCard
                  label="적중률"
                  value={stats.totalVotes === 0 ? '-' : `${stats.correctRate}`}
                  unit={stats.totalVotes === 0 ? '' : '%'}
                  highlight
                />
              </div>

              <p className="text-[12px] text-[#9a9aa0] text-center">
                투표 결과 공개 후, 내 선택이 최다 득표 항목과 일치한 비율입니다.
              </p>
            </>
          ) : (
            <div className="text-center py-12 text-[14px] text-[#9a9aa0]">불러오는 중...</div>
          )}

          {/* 관리자 메시지 아코디언 */}
          {adminMessages && adminMessages.length > 0 && (
            <div className="border border-orange-200 dark:border-orange-900/50 rounded-2xl overflow-hidden">
              <button
                onClick={() => setMessagesOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-orange-500 text-[15px]">⚠️</span>
                  <span className="text-[13px] font-semibold text-orange-700 dark:text-orange-400">
                    운영팀 메시지 {adminMessages.length}건
                  </span>
                </div>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`text-orange-400 transition-transform duration-200 ${messagesOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {messagesOpen && (
                <div className="divide-y divide-orange-100 dark:divide-orange-900/30">
                  {adminMessages.map((m, i) => (
                    <div key={m.id} className="px-4 py-3.5 bg-white dark:bg-[#1c1c1e]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-orange-500">경고 #{adminMessages.length - i}</span>
                        <span className="text-[11px] text-[#9a9aa0]">
                          {new Date(m.createdAt).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#3a3a40] dark:text-[#c0c0c6] leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 투표 내역 탭 */}
      {tab === 'votes' && (
        <div className="space-y-3">
          {votes.length === 0 ? (
            <div className="text-center py-16 text-[14px] text-[#9a9aa0]">아직 투표한 게시글이 없어요.</div>
          ) : (
            <>
              {votes.map(v => (
                <Link
                  key={v.postId}
                  href={`/posts/${v.postId}`}
                  className="block p-4 bg-white dark:bg-[#1c1c1e] border border-[#ececec] dark:border-[#2a2a2e] rounded-2xl hover:border-[#5658d6] dark:hover:border-[#5658d6] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#1c1c1e] dark:text-white truncate">{v.title}</p>
                      <p className="text-[12px] text-[#9a9aa0] mt-1">내 선택: {v.votedOption}</p>
                    </div>
                    {v.isCorrectPrediction !== null && (
                      <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        v.isCorrectPrediction
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-red-50 text-red-500 border border-red-200'
                      }`}>
                        {v.isCorrectPrediction ? '일치' : '불일치'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#c0c0c6] mt-2">
                    {new Date(v.votedAt).toLocaleDateString('ko-KR')} · 총 {v.totalVoteCount.toLocaleString()}명 참여
                  </p>
                </Link>
              ))}

              {/* 페이지네이션 */}
              {votesTotalPages > 1 && (
                <div className="flex justify-center gap-2 pt-2">
                  {Array.from({ length: votesTotalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => loadVotes(i)}
                      className={`w-8 h-8 rounded-full text-[13px] font-medium transition-colors ${
                        i === votesPage
                          ? 'bg-[#5658d6] text-white'
                          : 'text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 문의하기 탭 */}
      {tab === 'contact' && (
        <div>
          {contactDone ? (
            <div className="text-center py-16">
              <p className="text-[20px] mb-2">✉️</p>
              <p className="text-[15px] font-medium text-[#1c1c1e] dark:text-white">문의가 전송됐어요!</p>
              <p className="text-[13px] text-[#9a9aa0] mt-1 mb-4">빠른 시일 내에 답변 드릴게요.</p>
              <button
                onClick={() => setContactDone(false)}
                className="text-[13px] text-[#5658d6] hover:underline"
              >
                다시 문의하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleContact} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#3a3a40] dark:text-[#c0c0c6] mb-1.5">제목</label>
                <input
                  value={contactSubject}
                  onChange={e => setContactSubject(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="문의 제목을 입력해주세요"
                  className="w-full px-4 py-2.5 border border-[#d8d8d8] dark:border-[#3a3a3e] bg-white dark:bg-[#1c1c1e] text-[#1c1c1e] dark:text-white rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#5658d6] placeholder:text-[#c0c0c6]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#3a3a40] dark:text-[#c0c0c6] mb-1.5">내용</label>
                <textarea
                  value={contactBody}
                  onChange={e => setContactBody(e.target.value)}
                  required
                  maxLength={2000}
                  rows={7}
                  placeholder="버그 신고, 기능 건의, 기타 문의 등을 자유롭게 작성해주세요."
                  className="w-full px-4 py-3 border border-[#d8d8d8] dark:border-[#3a3a3e] bg-white dark:bg-[#1c1c1e] text-[#1c1c1e] dark:text-white rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#5658d6] placeholder:text-[#c0c0c6] resize-none"
                />
                <p className="text-right text-[11px] text-[#c0c0c6] mt-1">{contactBody.length}/2000</p>
              </div>
              {contactError && <p className="text-[13px] text-red-500">{contactError}</p>}
              <button
                type="submit"
                disabled={contactLoading}
                className="w-full py-3 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-xl text-[14px] font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                {contactLoading ? '전송 중...' : '문의 보내기'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 bg-white dark:bg-[#1c1c1e] border border-[#ececec] dark:border-[#2a2a2e] rounded-2xl">
      <span className="text-[13px] text-[#9a9aa0]">{label}</span>
      <span className="text-[14px] font-medium text-[#1c1c1e] dark:text-white">{value}</span>
    </div>
  );
}

function StatCard({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-[#ececec] dark:border-[#2a2a2e] rounded-2xl text-center">
      <p className="text-[11px] text-[#9a9aa0] mb-1">{label}</p>
      <p className={`text-[22px] font-bold ${highlight ? 'text-[#5658d6]' : 'text-[#1c1c1e] dark:text-white'}`}>
        {value}<span className="text-[13px] font-normal ml-0.5">{unit}</span>
      </p>
    </div>
  );
}
