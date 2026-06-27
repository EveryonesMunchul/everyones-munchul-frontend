'use client';

import { useState } from 'react';
import { postApi } from '@/lib/postApi';
import { extractErrorMessage } from '@/lib/errorUtils';

const REPORT_REASONS = [
  '스팸 / 홍보성 게시글',
  '욕설 / 혐오 표현',
  '허위 정보 / 낚시',
  '개인정보 노출',
  '기타',
];

interface Props {
  postId: number;
  onClose: () => void;
}

export default function ReportModal({ postId, onClose }: Props) {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await postApi.reportPost(postId, selected);
      setDone(true);
    } catch (e: any) {
      // 이미 신고한 게시글이면 성공으로 처리
      if (e?.response?.status === 409) {
        setDone(true);
      } else {
        setError(extractErrorMessage(e));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl w-full max-w-sm mx-4 p-6 shadow-xl">
        {done ? (
          <div className="text-center py-4">
            <p className="text-[15px] font-semibold text-[#1c1c1e] dark:text-white mb-1.5">신고가 접수됐어요</p>
            <p className="text-[13px] text-[#9a9aa0]">검토 후 처리될 예정이에요</p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] rounded-xl text-[14px] font-semibold"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-[16px] font-semibold text-[#1c1c1e] dark:text-white mb-1">신고하기</h2>
            <p className="text-[13px] text-[#9a9aa0] mb-5">신고 사유를 선택해주세요</p>

            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelected(reason)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-[14px] transition-colors border
                    ${selected === reason
                      ? 'border-[#1c1c1e] dark:border-white bg-[#f5f5f7] dark:bg-[#2a2a2e] font-medium text-[#1c1c1e] dark:text-white'
                      : 'border-[#ececec] dark:border-[#3a3a3e] text-[#3a3a40] dark:text-[#c0c0c6]'
                    }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {error && <p className="text-[13px] text-red-500 mt-3">{error}</p>}

            <div className="flex gap-2 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#ececec] dark:border-[#3a3a3e] text-[14px] text-[#9a9aa0] hover:border-[#1c1c1e] dark:hover:border-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected || loading}
                className="flex-1 py-3 rounded-xl bg-[#1c1c1e] dark:bg-white text-white dark:text-[#1c1c1e] text-[14px] font-semibold disabled:opacity-30"
              >
                {loading ? '신고 중...' : '신고'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
