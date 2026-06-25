'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenResponse } from '@/types';

interface AuthState {
  userId: number | null;
  nickname: string | null;
  role: string | null;
  isLoggedIn: boolean;
  login: (data: TokenResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      role: null,
      isLoggedIn: false,

      login: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        set({
          userId: data.userId,
          nickname: data.nickname,
          role: data.role,
          isLoggedIn: true,
        });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ userId: null, nickname: null, role: null, isLoggedIn: false });
      },
    }),
    { name: 'auth-store' }
  )
);
