'use client';

import { useState } from 'react';
import { Post, VoteOption } from '@/types';
import { postApi } from '@/lib/postApi';
import { useAuthStore } from '@/store/authStore';
import { CheckCircleIcon, LockIcon } from '@/components/Icons';

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

  if (voted && !post.isResultVisible) {
    return (
      <div className="text-center py-8 text-[#9a9aa0]">
        <div className="flex justify-center mb-3">
          <CheckCircleIcon size={40} />
        </div>
        <p className="text-[15px] font-semibold text-[#1c1c1e] dark:text-white">투표에 참여했어요!</p>
        <p className="text-[13px] mt-1.5">결과는 공개 일정이 되면 확인할 수 있어요</p>
        <button
          onClick={() => { setVoted(false); setSelected(null); }}
          className="mt-5 text-[13px] text-[#9a9aa0] underline underline-offset-2 hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
        >
          다시 투표하기
        </button>
      </div>
    );
  }

  if (voted || (post.isResultVisible && post.totalVoteCount > 0)) {
    return (
      <div>
        <ResultView options={post.voteOptions} total={post.totalVoteCount} isResultVisible={post.isResultVisible} />
        <div className="text-center mt-5">
          <button
            onClick={() => { setVoted(false); setSelected(null); }}
            className="text-[13px] text-[#9a9aa0] underline underline-offset-2 hover:text-[#1c1c1e] dark:hover:text-white transition-colors"
          >
            다시 투표하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[11px] font-semibold tracking-[.2em] text-[#9a9aa0] uppercase text-center mb-6">
        당신의 판결
      </div>

      {isExpired && (
        <p className="text-[13px] text-[#9a9aa0] text-center mb-4">투표가 마감된 사연입니다</p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {post.voteOptions.map((option) => (
          <button
            key={option.id}
            disabled={!!isExpired || loading}
            onClick={() => setSelected(option.id)}
            className={`px-7 py-3.5 rounded-full text-[14px] font-semibold transition-all
              ${selected === option.id
                ? 'bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] border border-[#1c1c1e] dark:border-white'
                : 'bg-white dark:bg-transparent text-[#1c1c1e] dark:text-white border border-[#d8d8d8] dark:border-[#3a3a3e] hover:border-[#1c1c1e] dark:hover:border-white'
              }
              ${isExpired ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {option.content}
          </button>
        ))}
      </div>

      {error && <p className="text-[13px] text-red-500 text-center mt-3">{error}</p>}

      {!isExpired && (
        <div className="text-center mt-5">
          <button
            onClick={handleVote}
            disabled={selected === null || loading}
            className="px-9 py-3.5 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full text-[14px] font-semibold disabled:opacity-30 hover:opacity-80 transition-opacity"
          >
            {loading ? '투표 중...' : '투표하기'}
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <p className="text-[12px] text-[#9a9aa0] text-center mt-3">
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
      <div className="text-center py-8 text-[#9a9aa0]">
        <div className="flex justify-center mb-3">
          <LockIcon size={40} />
        </div>
        <p className="text-[15px] font-semibold text-[#1c1c1e] dark:text-white">결과 비공개 중</p>
        <p className="text-[13px] mt-1.5">공개 일정이 되면 결과를 확인할 수 있어요</p>
      </div>
    );
  }

  const max = Math.max(...options.map((o) => o.voteCount ?? 0));

  return (
    <div className="space-y-5">
      {options.map((option) => {
        const count = option.voteCount ?? 0;
        const pct = option.percentage ?? (total > 0 ? Math.round((count / total) * 1000) / 10 : 0);
        const isWinner = count === max && max > 0;
        return (
          <div key={option.id}>
            <div className="flex justify-between text-[13px] mb-2">
              <span className={`font-semibold ${isWinner ? 'text-[#5658d6]' : 'text-[#1c1c1e] dark:text-white'}`}>
                {isWinner && '🏆 '}{option.content}
              </span>
              <span className="text-[#9a9aa0]">{pct}% ({count.toLocaleString()}명)</span>
            </div>
            <div className="h-[4px] bg-[#f0f0f0] dark:bg-[#2a2a2e] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isWinner ? 'bg-[#5658d6]' : 'bg-[#1c1c1e] dark:bg-white'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-[12px] text-[#9a9aa0] text-center pt-1">
        총 {total.toLocaleString()}명 참여
      </p>
    </div>
  );
}
