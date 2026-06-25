import api from './api';
import { TokenResponse } from '@/types';

export const authApi = {
  signup: (email: string, password: string, nickname: string) =>
    api.post<TokenResponse>('/api/auth/signup', { email, password, nickname }),

  login: (email: string, password: string) =>
    api.post<TokenResponse>('/api/auth/login', { email, password }),

  logout: () => api.post('/api/auth/logout'),
};
