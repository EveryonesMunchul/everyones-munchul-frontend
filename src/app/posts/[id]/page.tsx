'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post, VoteOption, CATEGORY_LABELS } from '@/types';
import { postApi } from '@/lib/postApi';
import { useAuthStore } from '@/store/authStore';
import VoteSection from '@/components/VoteSection';
import { CheckCircleIcon } from '@/components/Icons';

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
    setPost({ ...post, voteOptions: options, totalVoteCount: total, isResultVisible: !post.isResultHidden });
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
    return (
      <div className="text-center py-24 text-[#9a9aa0] text-[13px]">불러오는 중...</div>
    );
  }

  if (!post) return null;

  const isOwner = isLoggedIn && userId != null && post.authorId === userId;

  return (
    <div className="max-w-[720px] mx-auto">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="text-[13px] text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors flex items-center gap-1 mb-8"
      >
        ← 목록
      </button>

      {/* 카테고리 */}
      <div className="text-[11px] font-semibold tracking-[.2em] text-[#5658d6] uppercase">
        {CATEGORY_LABELS[post.category] ?? post.category}
        {post.isResultHidden && <span className="ml-3 text-[#9a9aa0] normal-case tracking-normal">· 결과 비공개</span>}
      </div>

      {/* 제목 */}
      <h1 className="mt-4 text-[30px] font-semibold text-[#1c1c1e] dark:text-white leading-[1.45] tracking-[-0.02em]">
        {post.title}
      </h1>

      {/* 메타 */}
      <div className="flex items-center gap-3 text-[13px] text-[#9a9aa0] mt-4 pb-7 border-b border-[#ececec] dark:border-[#2a2a2e]">
        <span>{post.authorNickname}</span>
        <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
        <span>투표 {post.totalVoteCount.toLocaleString()}명</span>
        <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
        <span>조회 {post.viewCount.toLocaleString()}</span>
        <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="ml-auto text-[12px] text-red-400 hover:text-red-600 transition-colors"
          >
            삭제
          </button>
        )}
      </div>

      {/* 본문 */}
      <p className="text-[16px] leading-[1.9] text-[#3a3a40] dark:text-[#c0c0c6] mt-7 whitespace-pre-wrap">
        {post.content}
      </p>

      {post.imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-6">
          {post.imageUrls.map((url, i) => (
            <img key={i} src={url} alt="" className="rounded-lg w-full object-cover max-h-60" />
          ))}
        </div>
      )}

      {/* 투표 */}
      <div className="mt-11 pt-9 pb-9 border-t border-[#ececec] dark:border-[#2a2a2e] border-b">
        <VoteSection post={post} onVoted={handleVoted} />

        {post.isResultHidden && !post.isResultVisible && isLoggedIn && (
          <div className="mt-8 pt-7 border-t border-[#ececec] dark:border-[#2a2a2e]">
            <p className="text-[13px] text-[#9a9aa0] mb-4 text-center">
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
    return (
      <div className="flex flex-col items-center gap-2">
        <CheckCircleIcon size={36} />
        <p className="text-[13px] text-[#5658d6] font-semibold text-center">
          예측 완료! 결과 공개 시 확인해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <p className="text-[13px] font-semibold text-[#1c1c1e] dark:text-white text-center mb-4">
        다수결 결과 예측
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`px-6 py-3 rounded-full text-[13px] font-medium transition-all
              ${selected === opt.id
                ? 'bg-amber-500 text-white border border-amber-500'
                : 'border border-[#d8d8d8] dark:border-[#3a3a3e] text-[#6a6a70] dark:text-[#9a9aa0] hover:border-amber-400'
              }`}
          >
            {opt.content}
          </button>
        ))}
      </div>
      {error && <p className="text-[12px] text-red-500 text-center">{error}</p>}
      <div className="text-center mt-4">
        <button
          onClick={handlePredict}
          disabled={selected === null}
          className="px-8 py-3 bg-amber-500 text-white rounded-full text-[13px] font-semibold disabled:opacity-30 hover:bg-amber-600 transition-colors"
        >
          예측하기
        </button>
      </div>
    </div>
  );
}
