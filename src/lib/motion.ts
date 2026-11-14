/**
 * Shared motion language for Spec Shootout — "Shutter & Lens".
 * Every animation uses these eases/durations so the site moves as one system:
 * crisp exposure-like reveals (expo.out), quick shutter closes (power3.in), no bouncy content.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  in: 'power3.in',
  inOut: 'power2.inOut',
  /** small UI pops only (badges) — never on content blocks */
  pop: 'back.out(1.7)',
} as const;

export const DUR = { xs: 0.18, sm: 0.32, md: 0.55, lg: 0.9, xl: 1.3 } as const;


gsap.defaults({ ease: EASE.out, duration: DUR.md });
ScrollTrigger.config({ ignoreMobileResize: true });

const RM = '(prefers-reduced-motion: reduce)';
export const DESKTOP = '(min-width: 900px) and (pointer: fine)';

export function reducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.(RM).matches;
}
export function isDesktop(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.(DESKTOP).matches;
}

// Elements that should start hidden until revealed are only hidden when motion is allowed (see fx.css).
if (typeof document !== 'undefined' && !reducedMotion()) document.documentElement.classList.add('motion');

/* ───────── intro gate: the home hero waits for the first-visit aperture intro ───────── */
let introDone = false;
const introWaiters: (() => void)[] = [];
export function whenIntroDone(fn: () => void) {
  if (introDone) fn();
  else introWaiters.push(fn);
}
export function markIntroDone() {
  introDone = true;
  introWaiters.splice(0).forEach((f) => f());
}

/* ───────── viewport reveals for content rendered progressively (Browse cards) ───────── */
let io: IntersectionObserver | null = null;
export function observeReveal(el: Element | null) {
  if (!el || reducedMotion() || typeof IntersectionObserver === 'undefined') {
    el?.setAttribute('data-in', '');
    return;
  }
  io ??= new IntersectionObserver(
    (entries) => {
      let k = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const t = e.target as HTMLElement;
        t.style.setProperty('--rd', `${Math.min(k++, 8) * 55}ms`);
        t.setAttribute('data-in', '');
        io!.unobserve(t);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
  );
  io.observe(el);
}

/* ───────── iris geometry (used by the intro and hero aperture) ───────── */
/** Path for an iris: outer disc minus a hexagonal opening with inradius `r`, rotated `rot` degrees. */
export function irisPath(R: number, r: number, rot: number): string {
  const circle = `M ${R} 0 A ${R} ${R} 0 1 0 ${-R} 0 A ${R} ${R} 0 1 0 ${R} 0 Z`;
  if (r <= 0.5) return circle;
  const vr = r / Math.cos(Math.PI / 6);
  let hex = '';
  for (let k = 0; k < 6; k++) {
    const a = ((rot + 30 + k * 60) * Math.PI) / 180;
    hex += `${k ? 'L' : 'M'} ${(vr * Math.cos(a)).toFixed(2)} ${(vr * Math.sin(a)).toFixed(2)} `;
  }
  return `${circle} ${hex}Z`;
}
/** Six blade-edge lines tangent to the opening — the detail that makes it read as a real iris. */
export function bladeLines(R: number, r: number, rot: number): string {
  let d = '';
  for (let k = 0; k < 6; k++) {
    const a = ((rot + k * 60) * Math.PI) / 180;
    const px = r * Math.cos(a);
    const py = r * Math.sin(a);
    const tx = -Math.sin(a);
    const ty = Math.cos(a);
    const L = R * 1.1;
    d += `M ${(px - tx * L).toFixed(2)} ${(py - ty * L).toFixed(2)} L ${(px + tx * L * 0.25).toFixed(2)} ${(py + ty * L * 0.25).toFixed(2)} `;
  }
  return d;
}

/** Tween any number shown as text (stats, budgets). */
export function countTo(el: HTMLElement, to: number, opts: { from?: number; format?: (n: number) => string; duration?: number; delay?: number } = {}) {
  const fmt = opts.format ?? ((n: number) => Math.round(n).toLocaleString('en-US'));
  const o = { v: opts.from ?? 0 };
  el.textContent = fmt(o.v);
  return gsap.to(o, { v: to, duration: opts.duration ?? 1.4, delay: opts.delay ?? 0, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
