export interface VoteOption {
  id: number;
  content: string;
  voteCount: number | null;
  percentage: number | null;
  displayOrder: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  authorId: number | null;
  authorNickname: string;
  viewCount: number;
  totalVoteCount: number;
  isResultHidden: boolean;
  isResultVisible: boolean;
  resultRevealAt: string | null;
  voteExpiresAt: string | null;
  voteOptions: VoteOption[];
  imageUrls: string[];
  createdAt: string;
  hasVoted: boolean;
  votedOptionId: number | null;
  isOwner: boolean;
}

export interface PostSummary {
  id: number;
  title: string;
  category: string;
  isAnonymous: boolean;
  authorNickname: string;
  viewCount: number;
  totalVoteCount: number;
  voteOptionCount: number;
  isResultHidden: boolean;
  voteExpiresAt: string | null;
  createdAt: string;
}

export interface TightPost {
  id: number;
  title: string;
  category: string;
  isAnonymous: boolean;
  authorNickname: string;
  totalVoteCount: number;
  option1Text: string;
  option1Pct: number;
  option2Text: string;
  option2Pct: number;
  voteExpiresAt: string | null;
  createdAt: string;
}

export interface AdjacentPost {
  id: number;
  title: string;
  category: string;
}

export interface AdjacentPostsResponse {
  prev: AdjacentPost | null;
  next: AdjacentPost | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  nickname: string;
  role: string;
}

export interface VoteResultResponse {
  postId: number;
  isResultVisible: boolean;
  resultRevealAt: string | null;
  totalVoteCount: number;
  options: VoteOption[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  LOVE: '연애/결혼',
  WORK: '직장/회사',
  GAME: '게임',
  FAMILY: '가족',
  FRIEND: '친구/인간관계',
  DAILY: '일상',
  ETC: '기타',
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS);
