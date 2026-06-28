'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORY_LABELS, AdjacentPostsResponse } from '@/types';
import { postApi } from '@/lib/postApi';
import { useAuthStore } from '@/store/authStore';
import { usePost } from '@/hooks/usePost';
import { useToastStore } from '@/store/toastStore';
import { extractErrorMessage } from '@/lib/errorUtils';
import VoteSection from '@/components/VoteSection';
import ReportModal from '@/components/ReportModal';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn, userId } = useAuthStore();
  const { post, loading, notFound, updateVoteResult } = usePost(Number(id));
  const { show: showToast } = useToastStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [adjacent, setAdjacent] = useState<AdjacentPostsResponse | null>(null);

  useEffect(() => {
    postApi.getAdjacentPosts(Number(id))
      .then(res => setAdjacent(res.data))
      .catch(() => {});
  }, [id]);

  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await postApi.deletePost(Number(id));
      router.push('/');
    } catch (e) {
      showToast(extractErrorMessage(e));
      setDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-[#9a9aa0] text-[13px]">불러오는 중...</div>;
  }

  if (notFound || !post) {
    return <div className="text-center py-24 text-[#9a9aa0] text-[13px]">게시글을 찾을 수 없습니다</div>;
  }

  const isOwner = isLoggedIn && userId != null && post.authorId === userId;

  return (
    <div className="max-w-[720px] mx-auto">
      <button
        onClick={() => router.back()}
        className="text-[13px] text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors flex items-center gap-1 mb-8"
      >
        ← 목록
      </button>

      <div className="text-[11px] font-semibold tracking-[.2em] text-[#5658d6] uppercase">
        {CATEGORY_LABELS[post.category] ?? post.category}
        {post.isResultHidden && (
          <span className="ml-3 text-[#9a9aa0] normal-case tracking-normal">· 결과 비공개</span>
        )}
      </div>

      <h1 className="mt-4 text-[22px] sm:text-[30px] font-semibold text-[#1c1c1e] dark:text-white leading-[1.45] tracking-[-0.02em]">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[13px] text-[#9a9aa0] mt-4 pb-7 border-b border-[#ececec] dark:border-[#2a2a2e]">
        <span>{post.authorNickname}</span>
        <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
        <span>투표 {post.totalVoteCount.toLocaleString()}명</span>
        <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
        <span>조회 {post.viewCount.toLocaleString()}</span>
        <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
        <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>

        <div className="ml-auto flex items-center gap-3">
          {!isOwner && isLoggedIn && (
            <button
              onClick={() => setReportOpen(true)}
              className="text-[12px] text-[#9a9aa0] hover:text-red-400 transition-colors"
            >
              신고
            </button>
          )}
          {isOwner && (
            deleteConfirm ? (
              <span className="flex items-center gap-2 text-[12px]">
                <span className="text-[#9a9aa0]">삭제할까요?</span>
                <button onClick={handleDelete} disabled={isDeleting} className="text-red-500 font-medium hover:text-red-600 disabled:opacity-50">{isDeleting ? '삭제 중...' : '확인'}</button>
                <button onClick={() => setDeleteConfirm(false)} disabled={isDeleting} className="text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white disabled:opacity-50">취소</button>
              </span>
            ) : (
              <button onClick={handleDelete} className="text-[12px] text-red-400 hover:text-red-600 transition-colors">
                삭제
              </button>
            )
          )}
        </div>
      </div>

      <p className="text-[16px] leading-[1.9] text-[#3a3a40] dark:text-[#c0c0c6] mt-7 whitespace-pre-wrap">
        {post.content}
      </p>

      {post.imageUrls.length > 0 && (
        <div className={`mt-6 ${post.imageUrls.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-2' : ''}`}>
          {post.imageUrls
            .filter((url) => { try { const p = new URL(url).protocol; return p === 'https:' || p === 'http:'; } catch { return false; } })
            .map((url, i) => (
              <div key={i} className="rounded-lg overflow-hidden bg-[#f5f5f7] dark:bg-[#1c1c1e]">
                <img src={url} alt="" className="w-full h-auto max-h-[480px] object-contain" />
              </div>
            ))}
        </div>
      )}

      <div className="mt-11 pt-9 pb-9 border-t border-[#ececec] dark:border-[#2a2a2e] border-b">
        <VoteSection post={post} onVoted={updateVoteResult} />
      </div>

      {/* 이전/다음 이야기 네비게이션 */}
      {adjacent && (adjacent.prev || adjacent.next) && (
        <nav className="mt-3 border-b border-[#ececec] dark:border-[#2a2a2e]">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {adjacent.prev ? (
              <Link
                href={`/posts/${adjacent.prev.id}`}
                className="group flex flex-col gap-1.5 px-1 py-5 sm:pr-8 border-b sm:border-b-0 sm:border-r border-[#ececec] dark:border-[#2a2a2e] hover:bg-[#fafafa] dark:hover:bg-white/[0.03] transition-colors rounded-sm"
              >
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#9a9aa0] tracking-wider uppercase">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                    <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  이전 이야기
                </span>
                <span className="text-[14px] sm:text-[15px] font-medium text-[#1c1c1e] dark:text-white leading-snug group-hover:text-[#5658d6] dark:group-hover:text-[#7b7de8] transition-colors line-clamp-2">
                  {adjacent.prev.title}
                </span>
                <span className="text-[11px] text-[#c4c4c8] dark:text-[#4a4a54]">
                  {CATEGORY_LABELS[adjacent.prev.category] ?? adjacent.prev.category}
                </span>
              </Link>
            ) : <div className="hidden sm:block" />}

            {adjacent.next ? (
              <Link
                href={`/posts/${adjacent.next.id}`}
                className="group flex flex-col gap-1.5 px-1 py-5 sm:pl-8 text-left sm:text-right hover:bg-[#fafafa] dark:hover:bg-white/[0.03] transition-colors rounded-sm"
              >
                <span className="flex items-center justify-start sm:justify-end gap-1 text-[11px] font-semibold text-[#9a9aa0] tracking-wider uppercase">
                  다음 이야기
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                    <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-[14px] sm:text-[15px] font-medium text-[#1c1c1e] dark:text-white leading-snug group-hover:text-[#5658d6] dark:group-hover:text-[#7b7de8] transition-colors line-clamp-2">
                  {adjacent.next.title}
                </span>
                <span className="text-[11px] text-[#c4c4c8] dark:text-[#4a4a54]">
                  {CATEGORY_LABELS[adjacent.next.category] ?? adjacent.next.category}
                </span>
              </Link>
            ) : <div className="hidden sm:block" />}
          </div>
        </nav>
      )}

      {reportOpen && (
        <ReportModal postId={post.id} onClose={() => setReportOpen(false)} />
      )}
    </div>
  );
}
