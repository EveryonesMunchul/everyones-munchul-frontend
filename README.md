# 모두의 문철 — Frontend

Next.js 16 (TypeScript) + Tailwind CSS 기반 웹 프론트엔드.

## 로컬 개발

```bash
npm install
npm run dev
# http://localhost:3000
```

백엔드가 `localhost:8080`에서 실행 중이어야 합니다.  
환경 변수는 `.env.local`에 설정합니다:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 디렉토리 구조

```
src/
├── app/                  # Next.js App Router 페이지
│   ├── page.tsx          # 홈 (배너, 핫글, 마감임박, 최신)
│   ├── posts/            # 목록 / 상세 / 작성
│   └── auth/             # 로그인 / 회원가입
├── components/           # 재사용 UI 컴포넌트
│   ├── VoteSection.tsx   # 투표 + 결과 그래프
│   ├── BannerCarousel.tsx
│   ├── ReportModal.tsx
│   └── ...
├── hooks/                # 커스텀 훅
│   ├── usePost.ts        # 게시글 단건 fetch
│   └── useHomePosts.ts   # 홈 데이터 fetch
├── lib/                  # API 클라이언트, 유틸
│   ├── api.ts            # axios + 토큰 자동 갱신
│   ├── postApi.ts
│   └── utils.ts
├── store/
│   └── authStore.ts      # Zustand (로그인 상태 persist)
└── types/
    └── index.ts          # 공통 타입 정의
```

## 주요 의존성

- `next` 16.2.9 / `react` 19
- `tailwindcss` 4
- `axios`
- `zustand` (상태 관리)
