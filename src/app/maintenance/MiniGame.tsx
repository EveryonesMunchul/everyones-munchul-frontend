'use client';

import { useEffect, useRef, useCallback } from 'react';

const CELL = 22;
const COLS = 30;
const ROWS = 18;
const LW = COLS * CELL;   // 660
const LH = ROWS * CELL;   // 396

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
  ms: number;         // ms per tick
  last: number;
  pulse: number;
}

const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };

function spawnFood(snake: Pt[]): Pt {
  let p: Pt;
  do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

function init(hi = 0): G {
  const snake = [{ x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }];
  return { phase: 'idle', snake, dir: 'R', queue: 'R', food: spawnFood(snake), score: 0, hi, ms: 145, last: 0, pulse: 0 };
}

export default function MiniGame() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const g = useRef<G>(init());
  const raf = useRef(0);
  const touch = useRef<Pt | null>(null);

  const startGame = useCallback(() => {
    g.current = init(g.current.hi);
    g.current.phase = 'play';
    g.current.last = performance.now();
  }, []);

  const steer = useCallback((d: Dir) => {
    if (g.current.phase !== 'play') return;
    if (d !== OPP[g.current.dir]) g.current.queue = d;
  }, []);

  useEffect(() => {
    const el = cvs.current;
    if (!el) return;
    const ctx = el.getContext('2d')!;

    /* ── 한 틱 ──────────────────────────────── */
    function tick() {
      const s = g.current;
      s.dir = s.queue;
      const h = s.snake[0];
      const nx: Pt = {
        x: h.x + (s.dir === 'R' ? 1 : s.dir === 'L' ? -1 : 0),
        y: h.y + (s.dir === 'D' ? 1 : s.dir === 'U' ? -1 : 0),
      };
      if (nx.x < 0 || nx.x >= COLS || nx.y < 0 || nx.y >= ROWS || s.snake.some(p => p.x === nx.x && p.y === nx.y)) {
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

    /* ── 렌더 ──────────────────────────────── */
    function draw() {
      const s = g.current;

      // 배경
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, LW, LH);

      // 그리드
      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= LW; x += CELL) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, LH); ctx.stroke();
      }
      for (let y = 0; y <= LH; y += CELL) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(LW, y); ctx.stroke();
      }

      // 먹이
      const fx = s.food.x * CELL + CELL / 2;
      const fy = s.food.y * CELL + CELL / 2;
      const fr = 6.5 + Math.sin(s.pulse) * 1.5;
      const grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr + 7);
      grd.addColorStop(0, 'rgba(201,160,90,.35)');
      grd.addColorStop(1, 'rgba(201,160,90,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(fx, fy, fr + 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.food;
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.4)';
      ctx.beginPath(); ctx.arc(fx - 2, fy - 2, fr * .38, 0, Math.PI * 2); ctx.fill();

      // 뱀
      const total = s.snake.length;
      s.snake.forEach((pt, i) => {
        const px = pt.x * CELL, py = pt.y * CELL;
        const pad = i === 0 ? 1 : 2;
        const r = i === 0 ? 8 : 5;

        ctx.fillStyle = i === 0 ? C.head : C.body(i / total);
        ctx.beginPath();
        ctx.roundRect(px + pad, py + pad, CELL - pad * 2, CELL - pad * 2, r);
        ctx.fill();

        // 머리 눈
        if (i === 0) {
          // 방향에 따라 눈 위치 결정
          type EyePair = [{ dx: number; dy: number }, { dx: number; dy: number }];
          const eyes: Record<Dir, EyePair> = {
            R: [{ dx: 14, dy:  6 }, { dx: 14, dy: 15 }],
            L: [{ dx:  7, dy:  6 }, { dx:  7, dy: 15 }],
            U: [{ dx:  6, dy:  7 }, { dx: 15, dy:  7 }],
            D: [{ dx:  6, dy: 14 }, { dx: 15, dy: 14 }],
          };
          eyes[s.dir].forEach(({ dx, dy }) => {
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(px + dx, py + dy, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = C.head;
            ctx.beginPath(); ctx.arc(px + dx + .5, py + dy + .5, 1.8, 0, Math.PI * 2); ctx.fill();
          });
        }
      });

      // 점수
      ctx.font = '600 13px -apple-system,"Pretendard",monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = C.text;
      ctx.fillText(`점수: ${s.score}`, LW - 10, 19);
      if (s.hi > 0) {
        ctx.fillStyle = '#c4c4c8';
        ctx.fillText(`최고: ${s.hi}`, LW - 86, 19);
      }

      // idle / over 오버레이
      if (s.phase !== 'play') {
        const isIdle = s.phase === 'idle';
        if (!isIdle) {
          ctx.fillStyle = 'rgba(245,245,247,.88)';
          ctx.fillRect(0, 0, LW, LH);
        }
        ctx.textAlign = 'center';

        if (isIdle) {
          // 하단에 안내 텍스트 배치
          const ty = LH - 44;
          ctx.fillStyle = 'rgba(245,245,247,.82)';
          ctx.beginPath();
          ctx.roundRect(LW / 2 - 200, ty - 16, 400, 52, 10);
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

    /* ── 루프 ──────────────────────────────── */
    function loop(t: number) {
      const s = g.current;
      s.pulse += 0.08;
      if (s.phase === 'play' && t - s.last >= s.ms) {
        tick();
        s.last = t;
      }
      draw();
      raf.current = requestAnimationFrame(loop);
    }

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  /* ── 키보드 ──────────────────────────────── */
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
      if (g.current.phase !== 'play') startGame();
      steer(d);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [startGame, steer]);

  return (
    <canvas
      ref={cvs}
      width={LW}
      height={LH}
      className="w-full max-w-[660px] cursor-pointer rounded-2xl border border-[#e4e4e7]"
      style={{ touchAction: 'none' }}
      onClick={() => { if (g.current.phase !== 'play') startGame(); }}
      onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={e => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          if (g.current.phase !== 'play') startGame();
          return;
        }
        if (g.current.phase !== 'play') startGame();
        if (Math.abs(dx) > Math.abs(dy)) steer(dx > 0 ? 'R' : 'L');
        else steer(dy > 0 ? 'D' : 'U');
      }}
    />
  );
}
