function toUtcMs(iso: string): number {
  // 백엔드가 LocalDateTime을 타임존 없이 반환하므로 Z를 붙여 UTC로 해석
  return new Date(iso.endsWith('Z') || iso.includes('+') ? iso : iso + 'Z').getTime();
}

export function formatDate(iso: string): string {
  const diff = (Date.now() - toUtcMs(iso)) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export function getTimeRemaining(isoDate: string | null | undefined): string {
  if (!isoDate) return '';
  const diff = toUtcMs(isoDate) - Date.now();
  if (diff <= 0) return '마감';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}시간`;
  return `D-${Math.floor(hours / 24)}`;
}

export function isUrgent(isoDate: string | null | undefined): boolean {
  if (!isoDate) return false;
  const diff = toUtcMs(isoDate) - Date.now();
  return diff > 0 && diff < 24 * 3600000;
}
