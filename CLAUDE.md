# everyones-munchul-frontend

Next.js App Router 기반 프론트엔드.

> **중요**: AGENTS.md의 Next.js 주의사항을 반드시 먼저 읽을 것.

## 기술 스택

- **프레임워크**: Next.js (App Router, `'use client'`)
- **상태관리**: Zustand + persist (localStorage)
- **HTTP**: axios + 인터셉터 (자동 토큰 갱신)
- **스타일**: Tailwind CSS
- **배포**: Vercel (main 브랜치 자동 배포)

## 디렉토리 구조

```
src/
├── app/
│   ├── page.tsx              # 홈 (인기/마감임박/최신 이야기)
│   ├── posts/
│   │   ├── page.tsx          # 이야기 목록
│   │   ├── new/page.tsx      # 이야기 작성
│   │   └── [id]/page.tsx     # 이야기 상세
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── callback/page.tsx # OAuth 콜백 (해시 프래그먼트 파싱)
│   ├── my/page.tsx           # 마이페이지
│   └── (정책) privacy, terms, rules, contact, notice
├── components/
│   ├── Header.tsx / Footer.tsx
│   ├── BannerCarousel.tsx    # 홈 우측 인기 이야기 캐러셀
│   ├── MediaUploader.tsx     # 이미지/동영상 업로드 (S3 Presigned)
│   ├── VoteSection.tsx       # 투표 UI
│   └── ThemeProvider.tsx     # 라이트/다크 모드 (기본: 라이트)
├── store/
│   └── authStore.ts          # 인증 상태 (Zustand persist)
├── lib/
│   ├── api.ts                # axios 인스턴스 + 401 인터셉터
│   ├── postApi.ts / userApi.ts / authApi.ts / uploadApi.ts
│   └── utils.ts              # formatDate, getTimeRemaining, isUrgent
└── hooks/
    └── useHomePosts.ts       # 홈 데이터 훅 (hot/closingSoon/latest)
```

## 인증 흐름

1. 사용자가 구글 로그인 → 백엔드 OAuth 처리
2. 백엔드가 `/auth/callback#accessToken=...&refreshToken=...`으로 리다이렉트
3. `callback/page.tsx`에서 `window.location.hash` 파싱 → `authStore.login()` 호출
4. 토큰은 `localStorage`에 저장, 유저 정보는 Zustand persist
5. `api.ts` 인터셉터가 모든 요청에 `Authorization: Bearer {token}` 추가
6. 401 응답 시 자동 refresh → 실패하면 `forceLogout()` + 로그인 페이지

## 주요 설계 결정

### 타임존 처리
백엔드 `LocalDateTime`이 타임존 없이 반환됨 (`"2026-06-28T07:47:23"`).
브라우저가 KST로 해석해 9시간 오차 발생 → `utils.ts`의 `toUtcMs()`로 `Z` 붙여 UTC로 파싱.

```typescript
// utils.ts
function toUtcMs(iso: string): number {
  return new Date(iso.endsWith('Z') || iso.includes('+') ? iso : iso + 'Z').getTime();
}
```

### 이미지 표시
`object-contain` + `max-h-[480px]` — 비율 유지, 크롭 없음.
단일 이미지: 전체 너비 / 복수 이미지: 2열 그리드.

### 투표 마감 일시 선택
`datetime-local` input 대신 날짜 input + 시간 select 분리.
시간 select는 30분 단위만 (`00:00, 00:30, 01:00 ...`).

### BannerCarousel
`hotPosts[0]` = featured (좌측 전체), `hotPosts[1..5]` = 캐러셀 (우측).
`hotList`가 빈 배열이면 캐러셀 미렌더 (이야기가 1개 이하일 때).

## Vercel 환경변수

```
NEXT_PUBLIC_API_URL=https://api.everyonesmunchul.site
```

## 용어 통일

서비스 내 콘텐츠를 지칭하는 표현은 **"이야기"** 로 통일.
(구버전 "사연"은 모두 교체 완료)
