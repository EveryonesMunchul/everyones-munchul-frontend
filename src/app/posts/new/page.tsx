'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postApi } from '@/lib/postApi';
import { CATEGORY_LABELS, CATEGORIES } from '@/types';
import { useAuthStore } from '@/store/authStore';
import MediaUploader from '@/components/MediaUploader';

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
    resultRevealAt: '',
    voteExpiresAt: '',
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const filled = options.filter((o) => o.trim());
    if (filled.length < 2) {
      setError('투표 항목을 2개 이상 입력해주세요');
      return;
    }
    if (form.isResultHidden && !form.resultRevealAt) {
      setError('결과 비공개 시 공개 일정을 설정해주세요');
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
        resultRevealAt: form.isResultHidden ? form.resultRevealAt : undefined,
        voteExpiresAt: form.voteExpiresAt || undefined,
        imageUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      });
      router.push(`/posts/${data.id}`);
    } catch (e: any) {
      setError(e.response?.data?.message ?? '사연 등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

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
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="제목을 입력하세요 (최대 100자)"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">내용</label>
          <textarea
            value={form.content}
            onChange={(e) => setField('content', e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="사연을 자세히 적어주세요"
          />
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
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
            <span className="text-sm text-gray-700 dark:text-gray-300">투표 결과 비공개 (날짜 지정)</span>
          </label>

          {form.isResultHidden && (
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">결과 공개 일시</label>
              <input type="datetime-local" value={form.resultRevealAt}
                onChange={(e) => setField('resultRevealAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">투표 마감 일시 (선택)</label>
            <input type="datetime-local" value={form.voteExpiresAt}
              onChange={(e) => setField('voteExpiresAt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
