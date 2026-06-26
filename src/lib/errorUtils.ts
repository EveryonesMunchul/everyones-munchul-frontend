import { AxiosError } from 'axios';

const FALLBACK = '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.';

const STATUS_MESSAGES: Record<number, string> = {
  400: '입력 정보를 다시 확인해주세요.',
  401: '로그인이 필요해요.',
  403: '접근 권한이 없어요.',
  404: '요청한 정보를 찾을 수 없어요.',
  409: '이미 처리된 요청이에요.',
  413: '파일 크기가 너무 커요.',
  429: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.',
  500: '서버에 문제가 생겼어요. 잠시 후 다시 시도해주세요.',
  503: '서버가 일시적으로 이용 불가해요.',
};

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // 네트워크 오류 (서버에 아예 닿지 못한 경우)
    if (!error.response) return '서버에 연결할 수 없어요. 네트워크를 확인해주세요.';

    const { status, data } = error.response;

    // 백엔드가 보낸 메시지가 있으면 우선 사용
    if (typeof data?.message === 'string' && data.message.length > 0) {
      return data.message;
    }

    return STATUS_MESSAGES[status] ?? FALLBACK;
  }

  if (error instanceof Error) {
    // 내부 JS 에러는 사용자에게 노출하지 않음
    return FALLBACK;
  }

  return FALLBACK;
}
