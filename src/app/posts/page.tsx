'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostSummary } from '@/types';
import { postApi } from '@/lib/postApi';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import { MailboxIcon } from '@/components/Icons';

function PostsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? '전체';

  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (cat: string, pg: number, reset = false) => {
    setLoading(true);
    try {
      const { data } = await postApi.getPosts(cat === '전체' ? undefined : cat, pg);
      setPosts((prev) => reset ? data.content : [...prev, ...data.content]);
      setHasMore(!data.last);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    fetchPosts(category, 0, true);
  }, [category, fetchPosts]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(category, next);
  };

  return (
    <div>
      <CategoryFilter selected={category} onChange={(cat) => { setCategory(cat); setPage(0); }} />

      <div className="mt-6">
        {posts.length === 0 && !loading && (
          <div className="text-center py-20 text-[#9a9aa0]">
            <div className="flex justify-center mb-3">
              <MailboxIcon size={56} />
            </div>
            <p className="text-[14px]">아직 이야기가 없어요. 첫 번째 이야기를 올려보세요!</p>
          </div>
        )}

        <div className="border-t border-[#ececec] dark:border-[#2a2a2e]">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {loading && (
          <div className="text-center py-10 text-[13px] text-[#9a9aa0]">불러오는 중...</div>
        )}

        {!loading && hasMore && posts.length > 0 && (
          <button
            onClick={loadMore}
            className="w-full py-4 mt-2 text-[13px] font-medium text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
          >
            더 보기
          </button>
        )}
      </div>
    </div>
  );
}

export default function PostsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[26px] font-semibold text-[#1c1c1e] dark:text-white tracking-[-0.01em]">
          이야기 목록
        </h1>
        <p className="text-[13px] text-[#9a9aa0] mt-1">
          모두의 이야기에 판결을 내려보세요
        </p>
      </div>
      <Suspense fallback={<div className="text-center py-10 text-[13px] text-[#9a9aa0]">불러오는 중...</div>}>
        <PostsContent />
      </Suspense>
    </div>
  );
}
