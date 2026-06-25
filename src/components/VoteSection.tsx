'use client';

import { useState } from 'react';
import { Post, VoteOption } from '@/types';
import { postApi } from '@/lib/postApi';
import { useAuthStore } from '@/store/authStore';

interface Props {
  post: Post;
  onVoted: (options: VoteOption[], total: number) => void;
}

export default function VoteSection({ post, onVoted }: Props) {
  const { isLoggedIn } = useAuthStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);

  const isExpired = post.voteExpiresAt && new Date(post.voteExpiresAt) < new Date();

  const handleVote = async () => {
    if (selected === null) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await postApi.vote(post.id, selected);
      setVoted(true);
      onVoted(data.options, data.totalVoteCount);
    } catch (e: any) {
      setError(e.response?.data?.message ?? '투표 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 결과 보여주기 (이미 투표했거나 결과 공개 상태)
  if (voted || (post.isResultVisible && post.totalVoteCount > 0)) {
    return (
      <ResultView
        options={post.voteOptions}
        total={post.totalVoteCount}
        isResultVisible={post.isResultVisible}
      />
    );
  }

  return (
    <div className="space-y-2">
      {isExpired && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">투표가 마감된 사연입니다</p>
      )}

      {post.voteOptions.map((option) => (
        <button
          key={option.id}
          disabled={!!isExpired || loading}
          onClick={() => setSelected(option.id)}
          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition
            ${selected === option.id
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600'
            }
            ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {option.content}
        </button>
      ))}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {!isExpired && (
        <button
          onClick={handleVote}
          disabled={selected === null || loading}
          className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-xl font-semibold
            disabled:opacity-40 hover:bg-indigo-700 transition"
        >
          {loading ? '투표 중...' : '투표하기'}
        </button>
      )}

      {!isLoggedIn && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          비회원도 투표할 수 있어요 (IP 기반)
        </p>
      )}
    </div>
  );
}

function ResultView({
  options,
  total,
  isResultVisible,
}: {
  options: VoteOption[];
  total: number;
  isResultVisible: boolean;
}) {
  if (!isResultVisible) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <p className="text-2xl mb-2">🔒</p>
        <p className="font-medium">결과 비공개 중</p>
        <p className="text-sm mt-1">공개 일정이 되면 결과를 확인할 수 있어요</p>
      </div>
    );
  }

  const max = Math.max(...options.map((o) => o.voteCount ?? 0));

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const count = option.voteCount ?? 0;
        const pct = option.percentage ?? (total > 0 ? Math.round((count / total) * 1000) / 10 : 0);
        const isWinner = count === max && max > 0;
        return (
          <div key={option.id}>
            <div className="flex justify-between text-sm mb-1">
              <span className={`font-medium ${isWinner ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {isWinner && '🏆 '}{option.content}
              </span>
              <span className="text-gray-500 dark:text-gray-400">{pct}% ({count.toLocaleString()}명)</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isWinner ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center pt-1">총 {total.toLocaleString()}명 참여</p>
    </div>
  );
}
