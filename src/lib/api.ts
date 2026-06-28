import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function forceLogout() {
  useAuthStore.getState().logout();
  window.location.href = '/auth/login';
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('no refresh token');

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/api/auth/refresh`,
          { refreshToken }
        );
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        forceLogout();
        // 네비게이션 진행 중이므로 절대 resolve되지 않는 promise 반환 (downstream .then() 방지)
        return new Promise(() => {});
      }
    }
    if (error.response?.status === 429) {
      const code = error.response.data?.code;
      const msg = code === 'TOO_MANY_REQUESTS'
        ? '요청이 너무 많아요. 잠시 후 다시 시도해주세요.'
        : (error.response.data?.message ?? '요청이 너무 많아요. 잠시 후 다시 시도해주세요.');
      useToastStore.getState().show(msg);
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export default api;
