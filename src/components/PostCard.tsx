import Link from 'next/link';
import { PostSummary, CATEGORY_LABELS } from '@/types';
import { formatDate } from '@/lib/utils';
import { LockIcon } from '@/components/Icons';

interface Props {
  post: PostSummary;
}

export default function PostCard({ post }: Props) {
  const isExpired = post.voteExpiresAt && new Date(post.voteExpiresAt) < new Date();

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="grid grid-cols-[1fr_160px] gap-8 items-center py-7 border-b border-[#f2f2f2] dark:border-[#1e1e22] hover:bg-[#fafafa] dark:hover:bg-white/5 -mx-2 px-2 transition-colors cursor-pointer">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[.16em] text-[#5658d6] uppercase mb-2">
            {CATEGORY_LABELS[post.category] ?? post.category}
            {post.isResultHidden && (
              <span className="ml-2 inline-flex items-center gap-1 text-[#9a9aa0] normal-case tracking-normal">
                · <LockIcon size={12} /> 결과 비공개
              </span>
            )}
            {isExpired && <span className="ml-2 text-[#9a9aa0] normal-case tracking-normal">· 마감</span>}
          </div>
          <h2 className="text-[17px] font-medium text-[#1c1c1e] dark:text-white leading-snug mb-1.5">
            {post.title}
          </h2>
          <p className="text-[12px] text-[#9a9aa0]">
            {post.authorNickname} · {post.totalVoteCount.toLocaleString()}명 · 조회 {post.viewCount.toLocaleString()} · {formatDate(post.createdAt)}
          </p>
        </div>

        <div className="flex-none">
          <div className="text-[12px] font-medium text-[#6a6a70] dark:text-[#9a9aa0] mb-2">
            {post.totalVoteCount.toLocaleString()}명 투표
          </div>
          <div className="h-[3px] bg-[#f0f0f0] dark:bg-[#2a2a2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1c1c1e] dark:bg-white rounded-full"
              style={{ width: post.totalVoteCount > 0 ? '100%' : '0%', opacity: post.totalVoteCount > 0 ? 1 : 0 }}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

