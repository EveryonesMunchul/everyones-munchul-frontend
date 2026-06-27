import type { NextConfig } from "next";

const securityHeaders = [
  // MIME 스니핑 방지 — 브라우저가 Content-Type을 임의로 추측하지 못하게 함
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // 클릭재킹 방지 — 다른 사이트에서 iframe으로 삽입 불가
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Referer 헤더 제한 — 외부 요청 시 origin만 전달
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // 불필요한 브라우저 API 권한 차단
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
