import Link from 'next/link';
import { PostSummary, CATEGORY_LABELS } from '@/types';
import { formatDate } from '@/lib/utils';
import { LockIcon } from '@/components/Icons';

interface Props {
  post: PostSummary;
}

export default function MiniListRow({ post }: Props) {
  const isExpired = post.voteExpiresAt && new Date(post.voteExpiresAt) < new Date();

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="flex items-center justify-between py-5 border-b border-[#f2f2f2] dark:border-[#1e1e22] hover:bg-[#fafafa] dark:hover:bg-white/5 -mx-2 px-2 transition-colors cursor-pointer">
        <div className="flex-1 min-w-0 mr-6">
          <div className="text-[11px] font-semibold tracking-[.16em] text-[#5658d6] uppercase mb-1.5">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </div>
          <p className="text-[16px] font-medium text-[#1c1c1e] dark:text-white leading-snug truncate">
            {post.title}
          </p>
          <p className="text-[12px] text-[#9a9aa0] mt-1.5">
            {post.authorNickname} · {post.totalVoteCount.toLocaleString()}명 · {formatDate(post.createdAt)}
          </p>
        </div>
        <div className="flex-none flex items-center gap-2">
          {post.isResultHidden && <LockIcon size={14} />}
          {isExpired && (
            <span className="text-[11px] font-medium text-[#9a9aa0]">마감</span>
          )}
        </div>
      </div>
    </Link>
  );
}
