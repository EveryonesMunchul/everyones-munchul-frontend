import { useState, useEffect } from 'react';
import { PostSummary } from '@/types';
import { postApi } from '@/lib/postApi';

interface UseHomePostsResult {
  hotPosts: PostSummary[];
  closingSoon: PostSummary[];
  latestPosts: PostSummary[];
}

export function useHomePosts(): UseHomePostsResult {
  const [hotPosts, setHotPosts] = useState<PostSummary[]>([]);
  const [closingSoon, setClosingSoon] = useState<PostSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    postApi.getHotPosts().then(({ data }) => setHotPosts(data)).catch(() => {});
    postApi.getClosingSoonPosts().then(({ data }) => setClosingSoon(data)).catch(() => {});
    postApi.getPosts(undefined, 0)
      .then(({ data }) => setLatestPosts(data.content.slice(0, 5)))
      .catch(() => {});
  }, []);

  return { hotPosts, closingSoon, latestPosts };
}
