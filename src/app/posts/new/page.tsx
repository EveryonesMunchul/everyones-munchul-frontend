'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postApi } from '@/lib/postApi';
import { CATEGORY_LABELS, CATEGORIES } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { extractErrorMessage } from '@/lib/errorUtils';
import MediaUploader from '@/components/MediaUploader';

// 30분 단위 시간 선택지 생성
const TIME_OPTIONS: { label: string; value: string }[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30]) {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    TIME_OPTIONS.push({ label: `${hh}:${mm}`, value: `${hh}:${mm}` });
  }
}

function getNextHalfHour(): { date: string; time: string } {
  const now = new Date();
  const ms = now.getTime();
  const thirtyMin = 30 * 60 * 1000;
  const next = new Date(Math.ceil((ms + 1) / thirtyMin) * thirtyMin);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  const hh = String(next.getHours()).padStart(2, '0');
  const min = next.getMinutes() === 0 ? '00' : '30';
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` };
}

function getTodayString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function NewPostPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'DAILY',
    isAnonymous: false,
    isResultHidden: false,
  });
  const [expiresDate, setExpiresDate] = useState('');
  const [expiresTime, setExpiresTime] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) router.push('/auth/login');
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) {
    return <div className="text-center py-20 text-gray-400 text-sm">로딩 중...</div>;
  }

  const setField = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setOption = (i: number, val: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)));

  const addOption = () => {
    if (options.length < 5) setOptions((prev) => [...prev, '']);
  };

  const removeOption = (i: number) => {
    if (options.length > 2) setOptions((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleDateChange = (date: string) => {
    setExpiresDate(date);
    if (!expiresTime) {
      const { time } = getNextHalfHour();
      setExpiresTime(time);
    }
  };

  const getVoteExpiresAt = () => {
    if (!expiresDate || !expiresTime) return undefined;
    return `${expiresDate}T${expiresTime}`;
  };

  const POST_COOLDOWN_MS = 30_000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const filled = options.filter((o) => o.trim());
    if (filled.length < 2) {
      setError('투표 항목을 2개 이상 입력해주세요');
      return;
    }

    const voteExpiresAt = getVoteExpiresAt();
    if (form.isResultHidden && !voteExpiresAt) {
      setError('결과 비공개 시 투표 마감 일시를 설정해주세요');
      return;
    }
    if (voteExpiresAt && new Date(voteExpiresAt) <= new Date()) {
      setError('투표 마감 일시는 현재 시각 이후로 설정해주세요');
      return;
    }

    const lastPost = localStorage.getItem('lastPostAt');
    const elapsed = lastPost ? Date.now() - Number(lastPost) : Infinity;
    if (elapsed < POST_COOLDOWN_MS) {
      setError(`${Math.ceil((POST_COOLDOWN_MS - elapsed) / 1000)}초 후에 다시 등록할 수 있습니다`);
      return;
    }

    setLoading(true);
    try {
      const { data } = await postApi.createPost({
        title: form.title,
        content: form.content,
        category: form.category,
        isAnonymous: form.isAnonymous,
        voteOptions: filled,
        isResultHidden: form.isResultHidden,
        voteExpiresAt,
        imageUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      });
      localStorage.setItem('lastPostAt', String(Date.now()));
      router.push(`/posts/${data.id}`);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500';
  const selectClass = 'px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">사연 올리기</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setField('category', cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition
                  ${form.category === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">제목</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            required
            maxLength={100}
            className={inputClass}
            placeholder="제목을 입력하세요 (최대 100자)"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            내용 <span className="text-xs font-normal text-gray-400">(선택)</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setField('content', e.target.value)}
            maxLength={3000}
            rows={5}
            className={`${inputClass} resize-none`}
            placeholder="사연을 자세히 적어주세요"
          />
          <p className="text-right text-xs text-gray-400 mt-1">{form.content.length}/3000</p>
        </div>

        {/* 투표 항목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">투표 항목 (2~5개)</label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  maxLength={100}
                  className={inputClass}
                  placeholder={`선택지 ${i + 1}`}
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)}
                    className="text-gray-400 hover:text-red-400 px-2">✕</button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button type="button" onClick={addOption}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition">
                + 항목 추가
              </button>
            )}
          </div>
        </div>

        {/* 사진/동영상 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            사진 / 동영상 <span className="text-xs font-normal text-gray-400">(선택 · 최대 5개)</span>
          </label>
          <MediaUploader onChange={setMediaUrls} />
        </div>

        {/* 옵션들 */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isAnonymous}
              onChange={(e) => setField('isAnonymous', e.target.checked)}
              className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">익명으로 올리기</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isResultHidden}
              onChange={(e) => setField('isResultHidden', e.target.checked)}
              className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">투표 결과 비공개 (마감일에 공개)</span>
          </label>

          {/* 투표 마감 일시 — 날짜 + 30분 단위 시간 select */}
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              투표 마감 일시{form.isResultHidden ? ' (필수)' : ' (선택)'}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={expiresDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={getTodayString()}
                className={`flex-1 ${selectClass}`}
              />
              <select
                value={expiresTime}
                onChange={(e) => setExpiresTime(e.target.value)}
                disabled={!expiresDate}
                className={`${selectClass} disabled:opacity-40`}
              >
                <option value="">시간 선택</option>
                {TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {form.isResultHidden && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                투표 마감일에 결과가 자동 공개되며, 다수결과 같은 항목을 투표한 회원에게 경험치 +50이 지급됩니다.
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
          {loading ? '등록 중...' : '사연 등록하기'}
        </button>
      </form>
    </div>
  );
}
