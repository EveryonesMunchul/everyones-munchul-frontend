'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/authApi';
import { useAuthStore } from '@/store/authStore';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.signup(form.email, form.password, form.nickname);
      login(data);
      router.push('/');
    } catch (e: any) {
      setError(e.response?.data?.message ?? '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">회원가입</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: '이메일', field: 'email', type: 'email', placeholder: 'example@email.com' },
            { label: '비밀번호', field: 'password', type: 'password', placeholder: '8자 이상' },
            { label: '닉네임', field: 'nickname', type: 'text', placeholder: '2~30자' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={set(field)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder={placeholder}
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold
              hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
