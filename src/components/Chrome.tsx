/**
 * Site-wide "camera body" layer: first-visit aperture intro, shutter page transitions,
 * custom cursor + magnetic controls, scroll progress, header behaviour and background parallax.
 */
import { useEffect, useId, useRef } from 'react';
import { byId, SECTION_INFO, type Section } from '../data';
import { bladeLines, DESKTOP, EASE, gsap, irisPath, isDesktop, markIntroDone, reducedMotion, ScrollTrigger, useGSAP } from '../lib/motion';
import { registerShutter } from './Bits';

/* ═══════════════════ Aperture (SVG iris) ═══════════════════ */
export function Aperture({ className, R = 100 }: { className?: string; R?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox={`${-R * 1.12} ${-R * 1.12} ${R * 2.24} ${R * 2.24}`} aria-hidden>
      <defs>
        <clipPath id={`rim${id}`}>
          <circle r={R} />
        </clipPath>
      </defs>
      <circle r={R * 1.08} className="ap-ring" />
      <path className="ap-iris" d={irisPath(R, 0, 0)} fillRule="evenodd" />
      <path className="ap-blades" d={bladeLines(R, 0, 0)} clipPath={`url(#rim${id})`} />
      <circle r={R} className="ap-rim" />
    </svg>
  );
}
/** Drive an <Aperture> to opening `r` (0..R) and rotation `rot`. */
export function setIris(svg: SVGSVGElement | null, R: number, r: number, rot: number) {
  if (!svg) return;
  svg.querySelector('.ap-iris')?.setAttribute('d', irisPath(R, r, rot));
  svg.querySelector('.ap-blades')?.setAttribute('d', bladeLines(R, r, rot));
}

/* ═══════════════════ First-visit intro ═══════════════════ */
function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const first = typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('ss-intro') && !location.search.includes('nointro');
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return markIntroDone();
      if (!first || reducedMotion()) {
        el.remove();
        return markIntroDone();
      }
      sessionStorage.setItem('ss-intro', '1');
      const svg = el.querySelector('svg')!;
      const num = el.querySelector<HTMLElement>('.intro-count')!;
      const iris = { r: 0, rot: -40, n: 0 };
      const R = 100;
      const tl = gsap.timeline({
        defaults: { ease: EASE.expo },
        onComplete: () => {
          el.remove();
        },
      });
      tl.from('.intro-word span', { yPercent: 120, duration: 0.9, stagger: 0.035 }, 0.1)
        .from('.intro-meta > *', { autoAlpha: 0, y: 8, duration: 0.6, stagger: 0.08 }, 0.25)
        .to(iris, { n: 100, duration: 1.15, ease: 'power2.inOut', onUpdate: () => (num.textContent = String(Math.round(iris.n)).padStart(3, '0')) }, 0.15)
        .to(iris, { r: 34, rot: 20, duration: 1.0, ease: 'power2.inOut', onUpdate: () => setIris(svg, R, iris.r, iris.rot) }, 0.35)
        .to(iris, { r: R, rot: 70, duration: 0.75, ease: EASE.in, onUpdate: () => setIris(svg, R, iris.r, iris.rot) }, 1.35)
        .to(svg, { scale: 9, duration: 0.85, ease: EASE.in }, 1.45)
        .to('.intro-word, .intro-meta', { autoAlpha: 0, y: -20, duration: 0.4, ease: EASE.in }, 1.4)
        .add(markIntroDone, 1.75)
        .to(el, { autoAlpha: 0, duration: 0.35, ease: 'none' }, 1.9);
    },
    { scope: ref },
  );
  if (!first) return null;
  return (
    <div ref={ref} className="intro" aria-hidden>
      <Aperture className="intro-iris" />
      <div className="intro-word">
        {'SPEC SHOOTOUT'.split('').map((c, i) => (
          <span key={i}>{c === ' ' ? ' ' : c}</span>
        ))}
      </div>
      <div className="intro-meta mono">
        <span>ƒ/1.4</span>
        <span>
          FOCUS <b className="intro-count">000</b>
        </span>
        <span>ISO 100</span>
      </div>
    </div>
  );
}

/* ═══════════════════ Shutter page transition ═══════════════════ */
const label = (path: string) => {
  const [a, b] = path.split('/').filter(Boolean);
  if (a === 'p') return byId(b)?.model ?? 'Product';
  if (a === 'vs') return 'Versus';
  if (a === 'kits') return 'Gear paths';
  if (a === 'photos') return 'Photo manager';
  if (a === 'home' || !a) return 'Spec Shootout';
  return SECTION_INFO[a as Section]?.title ?? a;
};

function Shutter() {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const { contextSafe } = useGSAP({ scope: ref });
  useEffect(() => {
    const run = contextSafe((path: string, swap: () => void) => {
      if (busy.current) return swap();
      busy.current = true;
      const tl = gsap.timeline({ onComplete: () => void (busy.current = false) });
      const el = ref.current!;
      el.querySelector('.sh-label')!.textContent = label(path);
      tl.set(el, { autoAlpha: 1 })
        .fromTo('.sh-top', { yPercent: -101 }, { yPercent: 0, duration: 0.36, ease: EASE.in }, 0)
        .fromTo('.sh-bot', { yPercent: 101 }, { yPercent: 0, duration: 0.36, ease: EASE.in }, 0)
        .fromTo('.sh-center', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, 0.18)
        .add(swap, 0.38)
        .to('.sh-center', { autoAlpha: 0, scale: 1.08, duration: 0.25, ease: EASE.in }, 0.62)
        .to('.sh-top', { yPercent: -101, duration: 0.7, ease: EASE.expo }, 0.66)
        .to('.sh-bot', { yPercent: 101, duration: 0.7, ease: EASE.expo }, 0.66)
        .set(el, { autoAlpha: 0 });
    });
    registerShutter(reducedMotion() ? null : run);
    return () => registerShutter(null);
  }, [contextSafe]);
  return (
    <div ref={ref} className="shutter" aria-hidden>
      <div className="sh-top" />
      <div className="sh-bot" />
      <div className="sh-center">
        <span className="sh-dot" />
        <span className="sh-label" />
      </div>
    </div>
  );
}

/* ═══════════════════ Cursor + magnetic + spotlight ═══════════════════ */
const MAGNETIC = '.btn, .logo, nav button, [data-magnetic], .hs-chip';
const HOVERABLE = 'a, button, select, input, label, [data-cursor], .card';

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      if (reducedMotion()) return;
      // Native mouse cursor is kept: the custom dot/ring stay hidden (no `has-cursor` class).
      // This handler still drives the magnetic buttons and the card spotlight.
      const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
      const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
      const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
      const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });
      let magnet: HTMLElement | null = null;
      let mx: gsap.QuickToFunc | null = null;
      let my: gsap.QuickToFunc | null = null;
      let hover: Element | null = null;
      const lbl = ring.current!.querySelector('span')!;

      const release = () => {
        if (magnet && mx && my) {
          mx(0);
          my(0);
        }
        magnet = null;
      };
      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
        const t = e.target as Element;
        // magnetic pull toward the centre of buttons
        const m = t.closest?.(MAGNETIC) as HTMLElement | null;
        if (m !== magnet) {
          release();
          if (m) {
            magnet = m;
            mx = gsap.quickTo(m, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.45)' });
            my = gsap.quickTo(m, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.45)' });
          }
        }
        if (magnet && mx && my) {
          const r = magnet.getBoundingClientRect();
          const k = magnet.matches('nav button') ? 0.18 : 0.3;
          mx(gsap.utils.clamp(-12, 12, (e.clientX - (r.left + r.width / 2)) * k));
          my(gsap.utils.clamp(-10, 10, (e.clientY - (r.top + r.height / 2)) * k));
        }
        // spotlight position for cards
        const spot = t.closest?.('.card, .home-section, .hn-card, .kit-slot, .pt-card') as HTMLElement | null;
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
          spot.style.setProperty('--my', `${e.clientY - r.top}px`);
        }
        // ring state
        const h = t.closest?.(HOVERABLE) ?? null;
        if (h !== hover) {
          hover = h;
          const text = (h as HTMLElement | null)?.closest?.('[data-cursor]')?.getAttribute('data-cursor') ?? (h?.matches('.card') ? 'View' : '');
          const isText = !!h?.matches('input, select');
          lbl.textContent = text;
          gsap.to(ring.current, { scale: text ? 2.4 : h ? (isText ? 0.6 : 1.6) : 1, duration: 0.4, ease: EASE.out });
          gsap.to(lbl, { autoAlpha: text ? 1 : 0, duration: 0.2 });
          gsap.to(dot.current, { scale: h ? 0 : 1, duration: 0.25 });
        }
      };
      const down = () => gsap.to(ring.current, { scale: '-=0.25', duration: 0.12 });
      const up = () => gsap.to(ring.current, { scale: hover ? 1.6 : 1, duration: 0.35, ease: EASE.out });
      const leave = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
      const enter = () => gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2 });
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerdown', down);
      window.addEventListener('pointerup', up);
      document.documentElement.addEventListener('pointerleave', leave);
      document.documentElement.addEventListener('pointerenter', enter);
      return () => {
        release();
        document.documentElement.classList.remove('has-cursor');
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerdown', down);
        window.removeEventListener('pointerup', up);
        document.documentElement.removeEventListener('pointerleave', leave);
        document.documentElement.removeEventListener('pointerenter', enter);
      };
    });
    return () => mm.revert();
  });
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}

/* ═══════════════════ Scroll chrome ═══════════════════ */
function ScrollChrome({ routeKey }: { routeKey: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const header = document.querySelector<HTMLElement>('header.top');
      const prog = gsap.quickSetter(bar.current, 'scaleX');
      let hidden = false;
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          prog(self.progress);
          const y = self.scroll();
          const hide = self.direction === 1 && y > 220;
          if (header && hide !== hidden && (hide || self.direction === -1 || y < 220)) {
            hidden = hide;
            gsap.to(header, { yPercent: hide ? -110 : 0, duration: hide ? 0.35 : 0.55, ease: hide ? EASE.in : EASE.expo });
          }
          header?.classList.toggle('scrolled', y > 8);
        },
      });
      // background drifts against scroll for depth (desktop only — transform on one fixed layer)
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        gsap.fromTo('.aurora', { yPercent: 0 }, { yPercent: -10, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.2 } });
      });
      return () => {
        st.kill();
        mm.revert();
        if (header) gsap.set(header, { yPercent: 0 });
      };
    },
    { dependencies: [routeKey], revertOnUpdate: true },
  );
  return <div ref={bar} className="scroll-progress" aria-hidden />;
}

export function Chrome({ routeKey }: { routeKey: string }) {
  return (
    <>
      <Intro />
      <Shutter />
      {isDesktop() && <Cursor />}
      <ScrollChrome routeKey={routeKey} />
    </>
  );
}
