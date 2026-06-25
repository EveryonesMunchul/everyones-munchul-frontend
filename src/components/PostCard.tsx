import Link from 'next/link';
import { PostSummary, CATEGORY_LABELS } from '@/types';

interface Props {
  post: PostSummary;
}

export default function PostCard({ post }: Props) {
  const isExpired = post.voteExpiresAt && new Date(post.voteExpiresAt) < new Date();

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="bg-white dark:bg-[#1a1d27] rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm transition cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          {post.isResultHidden && (
            <span className="text-xs px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
              결과 비공개
            </span>
          )}
          {isExpired && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
              투표 마감
            </span>
          )}
        </div>

        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {post.title}
        </h2>

        <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-3">
            <span>{post.authorNickname}</span>
            <span>투표 {post.totalVoteCount.toLocaleString()}명</span>
            <span>조회 {post.viewCount.toLocaleString()}</span>
          </div>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </article>
    </Link>
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}
