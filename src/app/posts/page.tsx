'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostSummary } from '@/types';
import { postApi } from '@/lib/postApi';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';

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
    <div className="space-y-4">
      <CategoryFilter selected={category} onChange={(cat) => { setCategory(cat); setPage(0); }} />
      <div className="flex flex-col gap-2">
        {posts.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-4xl mb-3">📭</p>
            <p>아직 사연이 없어요. 첫 번째 사연을 올려보세요!</p>
          </div>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {loading && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">불러오는 중...</div>
        )}
        {!loading && hasMore && posts.length > 0 && (
          <button
            onClick={loadMore}
            className="w-full py-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
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
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-gray-900 dark:text-white">사연 목록</h1>
      <Suspense fallback={<div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">불러오는 중...</div>}>
        <PostsContent />
      </Suspense>
    </div>
  );
}
