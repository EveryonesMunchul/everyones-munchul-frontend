import { useState, useEffect } from 'react';
import { PostSummary, TightPost } from '@/types';
import { postApi } from '@/lib/postApi';

interface UseHomePostsResult {
  featuredPost: PostSummary | null;
  hotPosts: PostSummary[];
  closingSoon: PostSummary[];
  latestPosts: PostSummary[];
  tightPosts: TightPost[];
  loading: boolean;
}

export function useHomePosts(): UseHomePostsResult {
  const [featuredPost, setFeaturedPost] = useState<PostSummary | null>(null);
  const [hotPosts, setHotPosts] = useState<PostSummary[]>([]);
  const [closingSoon, setClosingSoon] = useState<PostSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<PostSummary[]>([]);
  const [tightPosts, setTightPosts] = useState<TightPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      postApi.getFeaturedPost().then(({ data }) => setFeaturedPost(data)).catch(() => {}),
      postApi.getHotPosts().then(({ data }) => setHotPosts(data)),
      postApi.getClosingSoonPosts().then(({ data }) => setClosingSoon(data)),
      postApi.getPosts(undefined, 0).then(({ data }) => setLatestPosts(data.content.slice(0, 5))),
      postApi.getTightPosts().then(({ data }) => setTightPosts(data)),
    ]).finally(() => setLoading(false));
  }, []);

  return { featuredPost, hotPosts, closingSoon, latestPosts, tightPosts, loading };
}
