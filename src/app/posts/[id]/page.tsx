'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post, VoteOption, CATEGORY_LABELS } from '@/types';
import { postApi } from '@/lib/postApi';
import { useAuthStore } from '@/store/authStore';
import VoteSection from '@/components/VoteSection';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn, userId } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi.getPost(Number(id))
      .then(({ data }) => setPost(data))
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleVoted = (options: VoteOption[], total: number) => {
    if (!post) return;
    setPost({ ...post, voteOptions: options, totalVoteCount: total, isResultVisible: true });
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠어요?')) return;
    try {
      await postApi.deletePost(Number(id));
      router.push('/');
    } catch (e: any) {
      alert(e.response?.data?.message ?? '삭제에 실패했습니다');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400 dark:text-gray-500">불러오는 중...</div>;
  }

  if (!post) return null;

  const isOwner = isLoggedIn && post.authorNickname !== '익명';

  return (
    <div className="space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
      >
        ← 목록으로
      </button>

      {/* 게시글 */}
      <article className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            {post.isResultHidden && (
              <span className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                결과 비공개
              </span>
            )}
          </div>
          {isOwner && (
            <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600">
              삭제
            </button>
          )}
        </div>

        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
          <span>{post.authorNickname}</span>
          <span>조회 {post.viewCount.toLocaleString()}</span>
          <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {post.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {post.imageUrls.map((url, i) => (
              <img key={i} src={url} alt="" className="rounded-xl w-full object-cover max-h-60" />
            ))}
          </div>
        )}
      </article>

      {/* 투표 섹션 */}
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          투표해주세요 ({post.totalVoteCount.toLocaleString()}명 참여)
        </h2>
        <VoteSection post={post} onVoted={handleVoted} />

        {post.isResultHidden && !post.isResultVisible && isLoggedIn && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              결과가 공개되기 전에 다수결 결과를 예측해보세요! 맞추면 경험치 +50
            </p>
            <PredictSection postId={post.id} options={post.voteOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

function PredictSection({ postId, options }: { postId: number; options: VoteOption[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (selected === null) return;
    try {
      await postApi.predict(postId, selected);
      setDone(true);
    } catch (e: any) {
      setError(e.response?.data?.message ?? '예측 실패');
    }
  };

  if (done) {
    return <p className="text-sm text-indigo-600 font-medium">✅ 예측 완료! 결과 공개 시 확인해보세요</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">다수결 결과 예측</p>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setSelected(opt.id)}
          className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition
            ${selected === opt.id
              ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300 dark:hover:border-amber-600'
            }`}
        >
          {opt.content}
        </button>
      ))}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handlePredict}
        disabled={selected === null}
        className="w-full py-2 bg-amber-500 text-white rounded-lg text-sm font-medium
          disabled:opacity-40 hover:bg-amber-600 transition"
      >
        예측하기
      </button>
    </div>
  );
}
