'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TokenResponse } from '@/types';

interface AuthState {
  userId: number | null;
  nickname: string | null;
  role: string | null;
  isLoggedIn: boolean;
  _hasHydrated: boolean;
  login: (data: TokenResponse) => void;
  logout: () => void;
}

let _set: ((partial: Partial<AuthState>) => void) | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      _set = set;
      return {
        userId: null,
        nickname: null,
        role: null,
        isLoggedIn: false,
        _hasHydrated: false,

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
      };
    },
    {
      name: 'auth-store',
      partialize: (state) => ({
        userId: state.userId,
        nickname: state.nickname,
        role: state.role,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => () => {
        _set?.({ _hasHydrated: true });
      },
    }
  )
);
