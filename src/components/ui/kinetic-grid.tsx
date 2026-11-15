import { useEffect, useRef } from 'react';

/**
 * Kinetic grid background: a faint grid that bends away from the mouse, lights up amber near it,
 * and sends out a ripple on every click/tap.
 *
 * Adapted for this site (from a Tailwind/shadcn component):
 * - transparent canvas, so the existing aurora glows and dot texture show through;
 * - brand colours (amber accent, blue ripple) and very faint lines so text stays easy to read;
 * - sharp on high-DPI screens; stops drawing when nothing is moving (saves battery);
 * - the glow fades in/out when the pointer enters/leaves the window instead of jumping;
 * - phones get tap ripples only; reduced-motion users get a still grid.
 */

type Point = { x: number; y: number };
type Ripple = { x: number; y: number; radius: number; opacity: number; born: number };
type RGBA = { r: number; g: number; b: number; a: number };

const INFLUENCE_RADIUS = 240;
const MAX_WARP = 22;
const LERP_SPEED = 0.09;
const NODE_BASE_RADIUS = 1.1;
const NODE_ACTIVE_RADIUS = 2.6;

const LINE_BASE: RGBA = { r: 255, g: 255, b: 255, a: 0.045 };
const NODE_BASE: RGBA = { r: 255, g: 255, b: 255, a: 0.09 };
const ACTIVE: RGBA = { r: 255, g: 181, b: 71, a: 0.75 }; // --accent #ffb547
const GLOW = '255,181,71';
const RIPPLE = '78,168,255'; // --c-photo blue

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: RGBA, b: RGBA, t: number) =>
  `rgba(${Math.round(lerp(a.r, b.r, t))},${Math.round(lerp(a.g, b.g, t))},${Math.round(lerp(a.b, b.b, t))},${lerp(a.a, b.a, t).toFixed(3)})`;
const smooth = (x: number) => x * x * (3 - 2 * x);

export default function KineticGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse: Point = { x: -9999, y: -9999 };
    const target: Point = { x: -9999, y: -9999 };
    let presence = 0; // 0..1, how strongly the pointer affects the grid
    let presenceTarget = 0;
    const ripples: Ripple[] = [];
    let W = 0;
    let H = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      kick();
    };

    const warp = (gx: number, gy: number, col: number, row: number, cols: number, rows: number) => {
      // keep the outer rows/columns pinned so the edges never wobble
      const m = 1.5;
      const pin = Math.min(col / m, (cols - 1 - col) / m, 1) ** 2 * Math.min(row / m, (rows - 1 - row) / m, 1) ** 2;
      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const dist = Math.hypot(dx, dy);
      const prox = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pin * presence;

      let rx = 0;
      let ry = 0;
      for (const r of ripples) {
        const rdx = gx - r.x;
        const rdy = gy - r.y;
        const diff = Math.hypot(rdx, rdy) - r.radius;
        if (Math.abs(diff) < 55) {
          const s = (1 - Math.abs(diff) / 55) * r.opacity * 16 * pin * (diff < 0 ? 1 : -1);
          const a = Math.atan2(rdy, rdx);
          rx += Math.cos(a) * s;
          ry += Math.sin(a) * s;
        }
      }
      if (dist < INFLUENCE_RADIUS && dist > 0 && prox > 0) {
        const t = dist / INFLUENCE_RADIUS;
        const amt = (1 - t) * (1 - t) * Math.min(1, dist / 60) * MAX_WARP * pin * presence;
        const a = Math.atan2(dy, dx);
        return { x: gx - Math.cos(a) * amt + rx, y: gy - Math.sin(a) * amt + ry, p: prox };
      }
      return { x: gx + rx, y: gy + ry, p: prox };
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 420);
        r.opacity = Math.max(0, 1 - age * 1.1);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      const cell = W < 700 ? 44 : 56;
      const cols = Math.max(2, Math.ceil(W / cell)) + 1;
      const rows = Math.max(2, Math.ceil(H / cell)) + 1;
      const cw = W / (cols - 1);
      const ch = H / (rows - 1);
      const pts: { x: number; y: number; p: number }[][] = [];
      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        for (let col = 0; col < cols; col++) pts[row][col] = warp(col * cw, row * ch, col, row, cols, rows);
      }

      // quiet segments in one batch, lit ones one by one
      const lit: [Point, Point, number][] = [];
      ctx.beginPath();
      const seg = (a: (typeof pts)[0][0], b: (typeof pts)[0][0]) => {
        const t = smooth((a.p + b.p) / 2);
        if (t > 0.01) lit.push([a, b, t]);
        else {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      };
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols - 1; col++) seg(pts[row][col], pts[row][col + 1]);
      for (let col = 0; col < cols; col++) for (let row = 0; row < rows - 1; row++) seg(pts[row][col], pts[row + 1][col]);
      ctx.strokeStyle = mix(LINE_BASE, LINE_BASE, 0);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      for (const [a, b, t] of lit) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = mix(LINE_BASE, { ...ACTIVE, a: 0.55 }, t);
        ctx.lineWidth = lerp(0.8, 1.4, t);
        ctx.stroke();
      }

      // nodes
      ctx.beginPath();
      for (const row of pts)
        for (const n of row)
          if (n.p <= 0.01) {
            ctx.moveTo(n.x + NODE_BASE_RADIUS, n.y);
            ctx.arc(n.x, n.y, NODE_BASE_RADIUS, 0, Math.PI * 2);
          }
      ctx.fillStyle = mix(NODE_BASE, NODE_BASE, 0);
      ctx.fill();
      for (const row of pts)
        for (const n of row) {
          if (n.p <= 0.01) continue;
          const t = smooth(n.p);
          const r = lerp(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);
          if (t > 0.3) {
            const gr = r + lerp(0, 7, (t - 0.3) / 0.7);
            const g = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, gr);
            g.addColorStop(0, `rgba(${GLOW},${(t * 0.35).toFixed(3)})`);
            g.addColorStop(1, `rgba(${GLOW},0)`);
            ctx.beginPath();
            ctx.arc(n.x, n.y, gr, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = mix(NODE_BASE, ACTIVE, t);
          ctx.fill();
        }

      for (const r of ripples) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RIPPLE},${(r.opacity * 0.3).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      mouse.x = lerp(mouse.x, target.x, LERP_SPEED);
      mouse.y = lerp(mouse.y, target.y, LERP_SPEED);
      presence = lerp(presence, presenceTarget, 0.06);
      draw(now);
      const settled = Math.abs(mouse.x - target.x) < 0.3 && Math.abs(mouse.y - target.y) < 0.3 && Math.abs(presence - presenceTarget) < 0.002;
      raf = settled && !ripples.length ? 0 : requestAnimationFrame(tick);
    };
    function kick() {
      if (still) return draw(performance.now());
      if (!raf) raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // touch: ripples only, no "hover"
      if (mouse.x === -9999) Object.assign(mouse, { x: e.clientX, y: e.clientY });
      target.x = e.clientX;
      target.y = e.clientY;
      presenceTarget = 1;
      kick();
    };
    const onLeave = () => {
      presenceTarget = 0;
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (still) return;
      ripples.push({ x: e.clientX, y: e.clientY, radius: 0, opacity: 1, born: performance.now() });
      if (ripples.length > 6) ripples.shift();
      kick();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`kinetic-grid ${className ?? ''}`} aria-hidden />;
}
