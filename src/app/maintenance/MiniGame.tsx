'use client';

import { useEffect, useRef, useCallback } from 'react';

const CELL = 30;
const COLS = 20;
// ROWS: 모바일(< 640px) = 16, 데스크탑 = 12

const C = {
  bg: '#f5f5f7',
  grid: '#ebebeb',
  head: '#1c1c1e',
  body: (t: number) => `hsl(0,0%,${Math.floor(18 + t * 46)}%)`,
  food: '#C9A05A',
  text: '#9a9aa0',
  dark: '#1c1c1e',
};

type Dir = 'U' | 'D' | 'L' | 'R';
type Pt = { x: number; y: number };

interface G {
  phase: 'idle' | 'play' | 'over';
  snake: Pt[];
  dir: Dir;
  queue: Dir;
  food: Pt;
  score: number;
  hi: number;
  ms: number;
  last: number;
  pulse: number;
}

const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };

export default function MiniGame() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const g = useRef<G | null>(null);
  const raf = useRef(0);
  const touch = useRef<Pt | null>(null);
  const isTouching = useRef(false);
  // 실제 사용되는 행 수와 캔버스 높이 (마운트 시 결정)
  const rows = useRef(12);
  const lh = useRef(COLS * CELL); // placeholder, overwritten on mount

  const startGameRef = useRef<() => void>(() => {});

  const steer = useCallback((d: Dir) => {
    if (!g.current || g.current.phase !== 'play') return;
    if (d !== OPP[g.current.dir]) g.current.queue = d;
  }, []);

  /* ── 터치 중 페이지 스크롤 방지 ──────────────── */
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isTouching.current) e.preventDefault();
    };
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, []);

  /* ── 게임 루프 (마운트 후 화면 크기 확정) ────── */
  useEffect(() => {
    const el = cvs.current;
    if (!el) return;
    const ctx = el.getContext('2d')!;

    // 화면 크기에 따라 행 수 결정
    rows.current = window.innerWidth < 640 ? 16 : 12;
    lh.current = rows.current * CELL;
    const LW = COLS * CELL;
    const LH = lh.current;
    el.width = LW;
    el.height = LH;

    function spawnFood(snake: Pt[]): Pt {
      let p: Pt;
      do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * rows.current) }; }
      while (snake.some(s => s.x === p.x && s.y === p.y));
      return p;
    }

    function mkInit(hi = 0): G {
      const midY = Math.floor(rows.current / 2);
      const snake = [{ x: 10, y: midY }, { x: 9, y: midY }, { x: 8, y: midY }];
      return { phase: 'idle', snake, dir: 'R', queue: 'R', food: spawnFood(snake), score: 0, hi, ms: 145, last: 0, pulse: 0 };
    }

    g.current = mkInit();

    const startGame = () => {
      g.current = mkInit(g.current?.hi ?? 0);
      g.current.phase = 'play';
      g.current.last = performance.now();
    };
    startGameRef.current = startGame;

    function tick() {
      const s = g.current!;
      s.dir = s.queue;
      const h = s.snake[0];
      const nx: Pt = {
        x: h.x + (s.dir === 'R' ? 1 : s.dir === 'L' ? -1 : 0),
        y: h.y + (s.dir === 'D' ? 1 : s.dir === 'U' ? -1 : 0),
      };
      if (nx.x < 0 || nx.x >= COLS || nx.y < 0 || nx.y >= rows.current || s.snake.some(p => p.x === nx.x && p.y === nx.y)) {
        s.phase = 'over';
        s.hi = Math.max(s.hi, s.score);
        return;
      }
      s.snake.unshift(nx);
      if (nx.x === s.food.x && nx.y === s.food.y) {
        s.score++;
        s.food = spawnFood(s.snake);
        s.ms = Math.max(75, 145 - s.score * 4);
      } else {
        s.snake.pop();
      }
    }

    function draw() {
      const s = g.current!;

      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, LW, LH);

      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= LW; x += CELL) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, LH); ctx.stroke();
      }
      for (let y = 0; y <= LH; y += CELL) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(LW, y); ctx.stroke();
      }

      const fx = s.food.x * CELL + CELL / 2;
      const fy = s.food.y * CELL + CELL / 2;
      const fr = 8.5 + Math.sin(s.pulse) * 2;
      const grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr + 9);
      grd.addColorStop(0, 'rgba(201,160,90,.35)');
      grd.addColorStop(1, 'rgba(201,160,90,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(fx, fy, fr + 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.food;
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.4)';
      ctx.beginPath(); ctx.arc(fx - 2.5, fy - 2.5, fr * .38, 0, Math.PI * 2); ctx.fill();

      const total = s.snake.length;
      s.snake.forEach((pt, i) => {
        const px = pt.x * CELL, py = pt.y * CELL;
        const pad = i === 0 ? 1 : 3;
        const r = i === 0 ? 11 : 7;
        ctx.fillStyle = i === 0 ? C.head : C.body(i / total);
        ctx.beginPath();
        ctx.roundRect(px + pad, py + pad, CELL - pad * 2, CELL - pad * 2, r);
        ctx.fill();

        if (i === 0) {
          type EyePair = [{ dx: number; dy: number }, { dx: number; dy: number }];
          const eyes: Record<Dir, EyePair> = {
            R: [{ dx: 19, dy:  8 }, { dx: 19, dy: 21 }],
            L: [{ dx: 10, dy:  8 }, { dx: 10, dy: 21 }],
            U: [{ dx:  8, dy: 10 }, { dx: 21, dy: 10 }],
            D: [{ dx:  8, dy: 20 }, { dx: 21, dy: 20 }],
          };
          eyes[s.dir].forEach(({ dx, dy }) => {
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(px + dx, py + dy, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = C.head;
            ctx.beginPath(); ctx.arc(px + dx + .5, py + dy + .5, 2.3, 0, Math.PI * 2); ctx.fill();
          });
        }
      });

      ctx.font = '600 13px -apple-system,"Pretendard",monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = C.text;
      ctx.fillText(`점수: ${s.score}`, LW - 10, 19);
      if (s.hi > 0) {
        ctx.fillStyle = '#c4c4c8';
        ctx.fillText(`최고: ${s.hi}`, LW - 84, 19);
      }

      if (s.phase !== 'play') {
        const isIdle = s.phase === 'idle';
        if (!isIdle) {
          ctx.fillStyle = 'rgba(245,245,247,.88)';
          ctx.fillRect(0, 0, LW, LH);
        }
        ctx.textAlign = 'center';

        if (isIdle) {
          const ty = LH - 44;
          ctx.fillStyle = 'rgba(245,245,247,.82)';
          ctx.beginPath();
          ctx.roundRect(LW / 2 - 190, ty - 16, 380, 52, 10);
          ctx.fill();
          ctx.fillStyle = C.dark;
          ctx.font = 'bold 14px -apple-system,"Pretendard",sans-serif';
          ctx.fillText('방향키 / WASD로 이동 — 먹이를 먹어 길어지세요!', LW / 2, ty);
          ctx.fillStyle = '#c4c4c8';
          ctx.font = '12px -apple-system,"Pretendard",sans-serif';
          ctx.fillText('모바일: 클릭 후 스와이프', LW / 2, ty + 20);
        } else {
          ctx.fillStyle = C.dark;
          ctx.font = 'bold 16px -apple-system,"Pretendard",sans-serif';
          ctx.fillText('GAME OVER', LW / 2, LH / 2 - 22);
          ctx.fillStyle = C.text;
          ctx.font = '13px -apple-system,"Pretendard",sans-serif';
          ctx.fillText(`점수: ${s.score}  ·  최고: ${s.hi}`, LW / 2, LH / 2 - 2);
          ctx.fillText('방향키 또는 클릭해서 재시작', LW / 2, LH / 2 + 20);
        }
      }
    }

    function loop(t: number) {
      const s = g.current!;
      s.pulse += 0.08;
      if (s.phase === 'play' && t - s.last >= s.ms) {
        tick();
        s.last = t;
      }
      draw();
      raf.current = requestAnimationFrame(loop);
    }

    raf.current = requestAnimationFrame(loop);

    // 클릭/탭 핸들러를 여기서 등록 (startGame 접근 위해)
    const handleClick = () => { if (g.current!.phase !== 'play') startGame(); };
    el.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener('click', handleClick);
    };
  }, []);

  /* ── 키보드 ──────────────────────────────────── */
  useEffect(() => {
    const MAP: Record<string, Dir> = {
      ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R',
      w: 'U', s: 'D', a: 'L', d: 'R',
      W: 'U', S: 'D', A: 'L', D: 'R',
    };
    const fn = (e: KeyboardEvent) => {
      const d = MAP[e.key];
      if (!d) return;
      e.preventDefault();
      if (g.current && g.current.phase !== 'play') startGameRef.current();
      steer(d);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [steer]);

  return (
    <canvas
      ref={cvs}
      className="w-full cursor-pointer sm:rounded-2xl border-y sm:border border-[#e4e4e7]"
      style={{ touchAction: 'none' }}
      onTouchStart={e => {
        isTouching.current = true;
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={e => {
        isTouching.current = false;
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        if (g.current && g.current.phase !== 'play') startGameRef.current();
        if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 'R' : 'L');
        else steer(dy > 0 ? 'D' : 'U');
      }}
      onTouchCancel={() => { isTouching.current = false; touch.current = null; }}
    />
  );
}
