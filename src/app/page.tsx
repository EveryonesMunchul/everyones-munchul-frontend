'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PostSummary, CATEGORY_LABELS, CATEGORIES } from '@/types';
import { postApi } from '@/lib/postApi';
import PostCard from '@/components/PostCard';

const CATEGORY_CONFIG: Record<string, { emoji: string; bg: string; border: string; text: string }> = {
  LOVE:   { emoji: '💕', bg: 'bg-rose-50 dark:bg-rose-900/20',    border: 'border-rose-100 dark:border-rose-800',    text: 'text-rose-600 dark:text-rose-400' },
  WORK:   { emoji: '💼', bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-100 dark:border-blue-800',    text: 'text-blue-600 dark:text-blue-400' },
  GAME:   { emoji: '🎮', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400' },
  FAMILY: { emoji: '🏡', bg: 'bg-green-50 dark:bg-green-900/20',  border: 'border-green-100 dark:border-green-800',  text: 'text-green-600 dark:text-green-400' },
  FRIEND: { emoji: '👫', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
  DAILY:  { emoji: '☀️', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-100 dark:border-yellow-800', text: 'text-yellow-600 dark:text-yellow-400' },
  ETC:    { emoji: '💬', bg: 'bg-gray-50 dark:bg-gray-800',       border: 'border-gray-100 dark:border-gray-700',    text: 'text-gray-600 dark:text-gray-400' },
};

export default function HomePage() {
  const [hotPosts, setHotPosts] = useState<PostSummary[]>([]);
  const [popularPosts, setPopularPosts] = useState<PostSummary[]>([]);
  const [closingSoon, setClosingSoon] = useState<PostSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    postApi.getHotPosts().then(({ data }) => setHotPosts(data)).catch(() => {});
    postApi.getPopularPosts().then(({ data }) => setPopularPosts(data)).catch(() => {});
    postApi.getClosingSoonPosts().then(({ data }) => setClosingSoon(data)).catch(() => {});
    postApi.getPosts(undefined, 0).then(({ data }) => setLatestPosts(data.content.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">

      {/* 실시간 핫 글 */}
      {hotPosts.length > 0 && (
        <section>
          <SectionHeader icon="🔥" title="실시간 핫 글" desc="투표가 가장 많이 몰린 사연" />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {hotPosts.map((post, i) => (
              <HotPostCard key={post.id} post={post} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* 많이 본 사연 */}
      {popularPosts.length > 0 && (
        <section>
          <SectionHeader icon="👁" title="많이 본 사연" desc="오늘 가장 많이 조회된 사연" />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {popularPosts.map((post, i) => (
              <HotPostCard key={post.id} post={post} rank={i + 1} showViews />
            ))}
          </div>
        </section>
      )}

      {/* 마감 임박 */}
      {closingSoon.length > 0 && (
        <section>
          <SectionHeader icon="⏰" title="투표 마감 임박" desc="곧 마감되는 사연, 지금 바로 참여하세요" />
          <div className="flex flex-col gap-2">
            {closingSoon.map((post) => (
              <ClosingSoonCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* 카테고리 탐색 */}
      <section>
        <SectionHeader icon="🗂" title="카테고리별 탐색" desc="관심 있는 주제의 사연을 찾아보세요" />
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <Link
                key={cat}
                href={`/posts?category=${cat}`}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border text-center transition hover:opacity-80
                  ${cfg.bg} ${cfg.border}`}
              >
                <span className="text-xl">{cfg.emoji}</span>
                <span className={`text-xs font-medium ${cfg.text}`}>{CATEGORY_LABELS[cat]}</span>
              </Link>
            );
          })}
          <Link
            href="/posts"
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 text-center transition hover:opacity-80"
          >
            <span className="text-xl">📋</span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">전체 보기</span>
          </Link>
        </div>
      </section>

      {/* 최신 사연 미리보기 */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <SectionHeader icon="📋" title="최신 사연" desc="방금 막 올라온 따끈따끈한 사연" />
          <Link
            href="/posts"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-3"
          >
            전체 보기 →
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">아직 사연이 없어요. 첫 번째 사연을 올려보세요!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <Link
              href="/posts"
              className="block w-full py-3 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
            >
              사연 더 보기
            </Link>
          </div>
        )}
      </section>

      {/* 광고 */}
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center text-xs text-gray-400 dark:text-gray-600">
        광고 영역
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div className="mb-3">
      <h2 className="flex items-center gap-1.5 text-base font-bold text-gray-900 dark:text-white">
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      {desc && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 ml-6">{desc}</p>}
    </div>
  );
}

function HotPostCard({ post, rank, showViews = false }: { post: PostSummary; rank: number; showViews?: boolean }) {
  const rankColor =
    rank === 1 ? 'text-amber-500' :
    rank === 2 ? 'text-gray-400' :
    rank === 3 ? 'text-orange-400' : 'text-gray-300 dark:text-gray-600';

  return (
    <Link href={`/posts/${post.id}`} className="flex-shrink-0 w-40">
      <div className="bg-white dark:bg-[#1a1d27] rounded-xl border border-gray-100 dark:border-gray-800 p-4 h-full hover:border-indigo-200 dark:hover:border-indigo-700 transition">
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`text-sm font-bold tabular-nums ${rankColor}`}>{rank}</span>
          <span className="text-xs px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full truncate">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-3 mb-2 leading-snug">
          {post.title}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {showViews ? `조회 ${post.viewCount.toLocaleString()}` : `투표 ${post.totalVoteCount.toLocaleString()}명`}
        </p>
      </div>
    </Link>
  );
}

function ClosingSoonCard({ post }: { post: PostSummary }) {
  const remaining = getTimeRemaining(post.voteExpiresAt as string);
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="flex items-center justify-between bg-white dark:bg-[#1a1d27] rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:border-amber-200 dark:hover:border-amber-700 transition">
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            투표 {post.totalVoteCount.toLocaleString()}명
          </p>
        </div>
        <span className="flex-shrink-0 text-xs px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-medium">
          {remaining}
        </span>
      </div>
    </Link>
  );
}

function getTimeRemaining(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return '마감';
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}시간 후`;
  const days = Math.floor(hours / 24);
  return `D-${days}`;
}
