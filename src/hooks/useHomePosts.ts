import { useState, useEffect } from 'react';
import { PostSummary } from '@/types';
import { postApi } from '@/lib/postApi';

interface UseHomePostsResult {
  hotPosts: PostSummary[];
  closingSoon: PostSummary[];
  latestPosts: PostSummary[];
  loading: boolean;
}

export function useHomePosts(): UseHomePostsResult {
  const [hotPosts, setHotPosts] = useState<PostSummary[]>([]);
  const [closingSoon, setClosingSoon] = useState<PostSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      postApi.getHotPosts().then(({ data }) => setHotPosts(data)),
      postApi.getClosingSoonPosts().then(({ data }) => setClosingSoon(data)),
      postApi.getPosts(undefined, 0).then(({ data }) => setLatestPosts(data.content.slice(0, 5))),
    ]).finally(() => setLoading(false));
  }, []);

  return { hotPosts, closingSoon, latestPosts, loading };
}
