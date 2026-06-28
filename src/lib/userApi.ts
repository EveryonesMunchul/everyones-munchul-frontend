import api from './api';
import { Page } from '@/types';

export interface MyProfile {
  id: number;
  email: string;
  nickname: string;
  provider: 'GOOGLE' | 'KAKAO' | 'NAVER' | null;
  grade: UserGrade;
  exp: number;
  joinedAt: string;
}

export interface MyStats {
  grade: UserGrade;
  exp: number;
  expForNextGrade: number;
  totalVotes: number;
  correctPredictions: number;
  correctRate: number;
}

export interface MyVotedPost {
  postId: number;
  title: string;
  votedOption: string;
  isCorrectPrediction: boolean | null;
  totalVoteCount: number;
  votedAt: string;
}

export type UserGrade = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER';

export interface AdminMessage {
  id: number;
  content: string;
  createdAt: string;
}

export const userApi = {
  getProfile: () => api.get<MyProfile>('/api/users/me'),
  changeNickname: (nickname: string) => api.patch<MyProfile>('/api/users/me/nickname', { nickname }),
  getStats: () => api.get<MyStats>('/api/users/me/stats'),
  getVotedPosts: (page = 0) =>
    api.get<Page<MyVotedPost>>('/api/users/me/votes', { params: { page, size: 10 } }),
  sendContact: (subject: string, body: string) =>
    api.post('/api/contact', { subject, body }),
  getAdminMessages: () => api.get<AdminMessage[]>('/api/users/me/messages'),
};
