import { useState, useEffect, useCallback } from 'react';
import { Post, VoteOption } from '@/types';
import { postApi } from '@/lib/postApi';

interface UsePostResult {
  post: Post | null;
  loading: boolean;
  notFound: boolean;
  updateVoteResult: (options: VoteOption[], total: number) => void;
}

export function usePost(id: number): UsePostResult {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    postApi.getPost(id)
      .then(({ data }) => setPost(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const updateVoteResult = useCallback((options: VoteOption[], total: number) => {
    setPost((prev) => prev
      ? { ...prev, voteOptions: options, totalVoteCount: total, isResultVisible: !prev.isResultHidden }
      : prev
    );
  }, []);

  return { post, loading, notFound, updateVoteResult };
}
