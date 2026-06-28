'use client';

import Link from 'next/link';
import { CATEGORY_LABELS } from '@/types';
import { isUrgent, getTimeRemaining } from '@/lib/utils';
import { useHomePosts } from '@/hooks/useHomePosts';
import BannerCarousel from '@/components/BannerCarousel';
import MiniListRow from '@/components/MiniListRow';
import { FlameIcon, HourglassIcon, ScaleIcon, MailboxIcon } from '@/components/Icons';

export default function HomePage() {
  const { featuredPost, hotPosts, closingSoon, latestPosts, tightPosts } = useHomePosts();

  // 관리자가 고정한 게시글 우선, 없으면 가장 인기 있는 게시글
  const featured = featuredPost ?? hotPosts[0];
  const hotList = hotPosts.filter(p => p.id !== featured?.id).slice(0, 5);

  return (
    <div>
      {/* ===== HERO ===== */}
      {featured && (
        <section className={`border border-[#ececec] dark:border-[#2a2a2e] rounded-sm overflow-hidden mb-0 ${hotList.length > 0 ? 'grid grid-cols-[1.5fr_1fr]' : ''}`}>
          <div className={`p-12 ${hotList.length > 0 ? 'border-r border-[#ececec] dark:border-[#2a2a2e]' : ''}`}>
            <div className="text-[11px] font-semibold tracking-[.22em] text-[#5658d6] uppercase">
              오늘의 사건 · {CATEGORY_LABELS[featured.category] ?? featured.category}
            </div>
            <h1 className="mt-5 text-[32px] font-semibold leading-[1.42] tracking-[-0.02em] text-[#1c1c1e] dark:text-white max-w-[540px]">
              {featured.title}
            </h1>
            <div className="mt-5 flex items-center gap-4 text-[13px] text-[#9a9aa0]">
              <span>{featured.authorNickname}</span>
              <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
              <span>투표 {featured.totalVoteCount.toLocaleString()}명</span>
              <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
              <span>조회 {featured.viewCount.toLocaleString()}</span>
            </div>
            <Link
              href={`/posts/${featured.id}`}
              className="mt-8 inline-block px-7 py-3.5 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full text-[14px] font-semibold hover:opacity-80 transition-opacity"
            >
              판결 참여하기
            </Link>
          </div>

          {hotList.length > 0 && <BannerCarousel posts={hotList} />}
        </section>
      )}

      {/* ===== DASHBOARD GRID ===== */}
      <section className="grid grid-cols-[1fr_1fr_1fr] border-x border-b border-[#ececec] dark:border-[#2a2a2e] mb-8">
        {/* 지금 뜨는 사연 */}
        <div className="p-8 border-r border-[#ececec] dark:border-[#2a2a2e]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#1c1c1e] dark:text-white">
              <FlameIcon size={22} />
              <span>지금 뜨는 이야기</span>
            </h2>
            <Link href="/posts" className="text-[12px] text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors">
              더보기
            </Link>
          </div>
          <div className="flex flex-col">
            {hotPosts.length === 0 && (
              <p className="text-[13px] text-[#9a9aa0]">이야기를 불러오는 중...</p>
            )}
            {(hotList.length > 0 ? hotList : hotPosts).slice(0, 5).map((post, i) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className="flex gap-4 items-baseline py-3.5 px-2 -mx-2 rounded-lg hover:bg-[#fafafa] dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <span className={`text-[17px] font-light w-4 flex-none tabular-nums ${i === 0 ? 'text-[#5658d6]' : 'text-[#c4c4c8]'}`}>
                    {i + (hotList.length > 0 ? 2 : 1)}
                  </span>
                  <div>
                    <p className="text-[14px] font-medium text-[#1c1c1e] dark:text-white leading-snug">
                      {post.title}
                    </p>
                    <p className="text-[12px] text-[#9a9aa0] mt-1">
                      {CATEGORY_LABELS[post.category]} · {post.totalVoteCount.toLocaleString()}명 투표
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 마감 임박 */}
        <div className="p-8 border-r border-[#ececec] dark:border-[#2a2a2e]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#1c1c1e] dark:text-white">
              <HourglassIcon size={22} />
              <span>마감 임박</span>
            </h2>
            <Link href="/posts" className="text-[12px] text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors">
              더보기
            </Link>
          </div>
          <div className="flex flex-col">
            {closingSoon.length === 0 ? (
              <p className="text-[13px] text-[#9a9aa0]">마감 임박 이야기가 없어요</p>
            ) : (
              closingSoon.slice(0, 4).map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <div className="py-3.5 px-2 -mx-2 rounded-lg hover:bg-[#fafafa] dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-[#f2f2f2] dark:border-[#1e1e22] last:border-b-0">
                    <p className="text-[14px] font-medium text-[#1c1c1e] dark:text-white leading-snug">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[12px] text-[#9a9aa0]">{post.totalVoteCount.toLocaleString()}명</span>
                      <span className={`text-[12px] font-semibold ${isUrgent(post.voteExpiresAt) ? 'text-[#d65656]' : 'text-[#9a9aa0]'}`}>
                        {getTimeRemaining(post.voteExpiresAt as string)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 팽팽한 대결 */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#1c1c1e] dark:text-white">
              <ScaleIcon size={22} />
              <span>팽팽한 대결</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {tightPosts.length === 0 ? (
              <p className="text-[13px] text-[#9a9aa0]">아직 팽팽한 대결이 없어요</p>
            ) : tightPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className="rounded-lg border border-[#ececec] dark:border-[#2a2a2e] p-3.5 hover:border-[#c8c8cc] dark:hover:border-[#4a4a4e] transition-colors cursor-pointer">
                  <p className="text-[13px] font-medium text-[#1c1c1e] dark:text-white leading-snug line-clamp-1 mb-2.5">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] mb-2">
                    <span className="text-[#5658d6] font-semibold w-[36px] text-right tabular-nums">{post.option1Pct}%</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#f0f0f2] dark:bg-[#2a2a2e]">
                      <div
                        className="h-full bg-[#5658d6] rounded-full transition-all"
                        style={{ width: `${post.option1Pct}%` }}
                      />
                    </div>
                    <span className="text-[#d65656] font-semibold w-[36px] tabular-nums">{post.option2Pct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#9a9aa0]">
                    <span className="truncate max-w-[40%]">{post.option1Text}</span>
                    <span className="shrink-0 mx-2">vs</span>
                    <span className="truncate max-w-[40%] text-right">{post.option2Text}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 최신 사연 ===== */}
      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[18px] font-semibold text-[#1c1c1e] dark:text-white tracking-[-0.01em]">최신 이야기</h2>
          <Link href="/posts" className="text-[13px] text-[#9a9aa0] hover:text-[#1c1c1e] dark:hover:text-white transition-colors">
            전체 이야기 →
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <div className="text-center py-12 text-[#9a9aa0]">
            <div className="flex justify-center mb-3"><MailboxIcon size={56} /></div>
            <p className="text-[14px]">아직 이야기가 없어요. 첫 번째 이야기를 올려보세요!</p>
          </div>
        ) : (
          <div className="border-t border-[#ececec] dark:border-[#2a2a2e]">
            {latestPosts.map((post) => <MiniListRow key={post.id} post={post} />)}
          </div>
        )}
      </section>

      {/* ===== CTA ===== */}
      <section className="py-14 text-center border border-[#ececec] dark:border-[#2a2a2e] rounded-sm mb-8">
        <h2 className="text-[26px] font-semibold text-[#1c1c1e] dark:text-white tracking-[-0.02em] leading-snug">
          억울한 일, 혼자 끙끙 앓지 마세요
        </h2>
        <p className="mt-3.5 text-[15px] text-[#6a6a70] max-w-[480px] mx-auto leading-relaxed">
          이야기를 올리면 수천 명의 배심원이 판결해 드립니다.
        </p>
        <Link href="/posts/new">
          <button className="mt-7 px-9 py-4 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-full text-[15px] font-semibold hover:opacity-80 transition-opacity">
            이야기 올리기
          </button>
        </Link>
      </section>

      {/* ===== 광고 ===== */}
      <div className="py-8 bg-[#fafafa] dark:bg-[#111115] border border-dashed border-[#d4d4d8] dark:border-[#2a2a2e] rounded-sm text-center text-[12px] text-[#b4b4b8] mb-2">
        광고 영역 · 광고 문의 ad@munchul.kr
      </div>
    </div>
  );
}
