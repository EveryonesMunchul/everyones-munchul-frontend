import { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const INK = 'fill-[#2E2A26] dark:fill-[#d8d3ca]';
const GOLD = '#C9A05A';
const vb = '0 0 48 48';

export function FlameIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M24 4c5 7 10 10 10 17a10 10 0 0 1-20 0c0-5 3-8 5-11 1 3 3 4 5 6-2-5-1-8 0-12Z" fill={GOLD} />
      <path d="M24 26c3 3 5 5 5 8a5 5 0 0 1-10 0c0-3 2-5 5-8Z" className={INK} />
    </svg>
  );
}

export function HourglassIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <rect x="14" y="6" width="20" height="3" rx="1.5" className={INK} />
      <rect x="14" y="39" width="20" height="3" rx="1.5" className={INK} />
      <path d="M17 9h14c0 7-7 9-7 15-7-6-7-8-7-15Z" className={INK} />
      <path d="M24 24c0 6 7 8 7 15H17c0-7 7-9 7-15Z" className={INK} />
      <path d="M20.5 38c0-3.5 3.5-4.5 3.5-7 0 2.5 3.5 3.5 3.5 7Z" fill={GOLD} />
    </svg>
  );
}

export function HeartIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M24 39S8 30 8 19.5A8.5 8.5 0 0 1 24 16a8.5 8.5 0 0 1 16 3.5C40 30 24 39 24 39Z" fill={GOLD} />
    </svg>
  );
}

export function BriefcaseIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M18 16v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" fill="none" className="stroke-[#2E2A26] dark:stroke-[#d8d3ca]" strokeWidth="2.8" strokeLinecap="round" />
      <rect x="8" y="16" width="32" height="22" rx="3.5" className={INK} />
      <rect x="20" y="23" width="8" height="5.5" rx="1.4" fill={GOLD} />
    </svg>
  );
}

export function GamepadIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M17 18h14a8 8 0 0 1 7.6 10.4l-1.2 4a3.6 3.6 0 0 1-6.6.7L29 31H19l-1.8 2.1a3.6 3.6 0 0 1-6.6-.7l-1.2-4A8 8 0 0 1 17 18Z" className={INK} />
      <path d="M15 23.5v4M13 25.5h4" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="31" cy="24.5" r="1.8" fill={GOLD} />
      <circle cx="34.5" cy="28" r="1.8" fill={GOLD} />
    </svg>
  );
}

export function HouseIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M8 24 24 10l16 14Z" fill={GOLD} />
      <path d="M13 22h22v16H13Z" className={INK} />
      <rect x="20" y="29" width="8" height="9" fill={GOLD} />
    </svg>
  );
}

export function PeopleIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <circle cx="17" cy="17" r="5.5" fill={GOLD} />
      <path d="M7 37c0-6 4.5-10 10-10s10 4 10 10Z" fill={GOLD} />
      <circle cx="32" cy="19" r="4.8" className={INK} />
      <path d="M24 37c.6-5 4-9 8-9 4.5 0 8 3.5 8.5 9Z" className={INK} />
    </svg>
  );
}

export function SunIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <circle cx="24" cy="24" r="8" fill={GOLD} />
      <g className="stroke-[#2E2A26] dark:stroke-[#d8d3ca]" strokeWidth="2.8" strokeLinecap="round">
        <path d="M24 6v4M24 38v4M6 24h4M38 24h4M11 11l3 3M34 34l3 3M37 11l-3 3M14 34l-3 3" />
      </g>
    </svg>
  );
}

export function ChatIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M9 11h30a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H27l-3 5-3-5H9a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3Z" className={INK} />
      <circle cx="17" cy="21" r="2.5" fill={GOLD} />
      <circle cx="24" cy="21" r="2.5" fill={GOLD} />
      <circle cx="31" cy="21" r="2.5" fill={GOLD} />
    </svg>
  );
}

export function ScaleIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <circle cx="24" cy="8" r="2.4" className={INK} />
      <rect x="22.6" y="10" width="2.8" height="25" rx="1.4" className={INK} />
      <rect x="12" y="12.6" width="24" height="2.8" rx="1.4" className={INK} />
      <path d="M13 14 8 23h10Z" fill={GOLD} />
      <path d="M35 14 30 23h10Z" fill={GOLD} />
      <rect x="15" y="34" width="18" height="2.8" rx="1.4" className={INK} />
    </svg>
  );
}

export function LockIcon({ size = 16, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <rect x="10" y="22" width="28" height="19" rx="3" className={INK} />
      <path d="M17 22v-5a7 7 0 0 1 14 0v5" className="stroke-[#2E2A26] dark:stroke-[#d8d3ca]" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="31" r="2.5" fill={GOLD} />
    </svg>
  );
}

export function MailboxIcon({ size = 48, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M16 24a8 8 0 0 1 16 0v13H16Z" className={INK} />
      <rect x="22.7" y="37" width="2.6" height="6" rx="1.3" className={INK} />
      <circle cx="19" cy="30.5" r="1.5" fill={GOLD} />
      <rect x="32" y="21" width="5" height="5" rx="1" fill={GOLD} />
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <circle cx="24" cy="24" r="16" fill={GOLD} />
      <path d="M15 24l7 7 11-12" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function MoonIcon({ size = 20, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox={vb} {...p}>
      <path d="M34 30A14 14 0 1 1 22 7a11 11 0 0 0 12 23Z" className={INK} />
    </svg>
  );
}
