import api from './api';
import { Post, PostSummary, TightPost, Page, VoteResultResponse } from '@/types';

export interface CreatePostPayload {
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  voteOptions: string[];
  isResultHidden: boolean;
  voteExpiresAt?: string;
  imageUrls?: string[];
}

export const postApi = {
  getPosts: (category?: string, page = 0, size = 20) =>
    api.get<Page<PostSummary>>('/api/posts', {
      params: { category, page, size, sort: 'createdAt,desc' },
    }),

  getPost: (id: number) => api.get<Post>(`/api/posts/${id}`),

  createPost: (payload: CreatePostPayload) => api.post<Post>('/api/posts', payload),

  deletePost: (id: number) => api.delete(`/api/posts/${id}`),

  vote: (postId: number, optionId: number) =>
    api.post<VoteResultResponse>(`/api/posts/${postId}/vote`, { optionId }),

  getResult: (postId: number) =>
    api.get<VoteResultResponse>(`/api/posts/${postId}/result`),

  getHotPosts: () => api.get<PostSummary[]>('/api/posts/hot'),

  getClosingSoonPosts: () => api.get<PostSummary[]>('/api/posts/closing-soon'),

  getPopularPosts: () => api.get<PostSummary[]>('/api/posts/popular'),

  getTightPosts: () => api.get<TightPost[]>('/api/posts/tight'),

  getFeaturedPost: () => api.get<PostSummary>('/api/posts/featured'),

  reportPost: (postId: number, reason: string) =>
    api.post(`/api/posts/${postId}/report`, { reason }),
};
