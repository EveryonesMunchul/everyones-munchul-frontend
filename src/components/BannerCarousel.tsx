'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PostSummary, CATEGORY_LABELS } from '@/types';
import { getTimeRemaining, isUrgent } from '@/lib/utils';

interface Props {
  posts: PostSummary[];
}

export default function BannerCarousel({ posts }: Props) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setIndex(next);
      setFading(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % posts.length;
        setFading(true);
        setTimeout(() => setFading(false), 200);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) {
    return null;
  }

  const post = posts[index];

  return (
    <div className="relative bg-[#fafafa] dark:bg-[#111115] flex flex-col justify-between p-10 overflow-hidden select-none">
      <div
        style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.2s ease' }}
        className="flex-1 flex flex-col"
      >
        <div className="text-[11px] font-semibold tracking-[.2em] text-[#5658d6] uppercase mb-3">
          {CATEGORY_LABELS[post.category] ?? post.category}
        </div>
        <p className="text-[18px] font-semibold text-[#1c1c1e] dark:text-white leading-[1.45] tracking-[-0.01em] flex-1">
          {post.title}
        </p>
        <div className="flex items-center gap-3 text-[12px] text-[#9a9aa0] mt-4">
          <span>투표 {post.totalVoteCount.toLocaleString()}명</span>
          <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
          <span>조회 {post.viewCount.toLocaleString()}</span>
          {post.voteExpiresAt && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
              <span className={isUrgent(post.voteExpiresAt) ? 'text-[#d65656] font-semibold' : ''}>
                {getTimeRemaining(post.voteExpiresAt)}
              </span>
            </>
          )}
        </div>
        <Link
          href={`/posts/${post.id}`}
          className="mt-5 self-start text-[13px] font-semibold text-[#1c1c1e] dark:text-white underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          판결 참여하기 →
        </Link>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-1.5">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${i === index ? 'w-4 h-1.5 bg-[#1c1c1e] dark:bg-white' : 'w-1.5 h-1.5 bg-[#d4d4d8] dark:bg-[#3a3a3e]'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => goTo((index - 1 + posts.length) % posts.length)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#e0e0e4] dark:border-[#3a3a3e] text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white hover:border-[#1c1c1e] dark:hover:border-white transition-colors text-[12px]"
          >
            ‹
          </button>
          <button
            onClick={() => goTo((index + 1) % posts.length)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-[#e0e0e4] dark:border-[#3a3a3e] text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white hover:border-[#1c1c1e] dark:hover:border-white transition-colors text-[12px]"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
