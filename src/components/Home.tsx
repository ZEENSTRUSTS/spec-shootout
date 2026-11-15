import { useEffect, useMemo, useRef, useState } from 'react';
import { brandsIn, byId, inSection, products, sectionOf, SECTION_INFO, type Section } from '../data';
import { TIERS, TRACKS } from '../data/kits';
import type { Product } from '../data/types';
import { DESKTOP, EASE, gsap, reducedMotion, ScrollTrigger, SplitText, useGSAP, whenIntroDone } from '../lib/motion';
import { allSets } from '../lib/photoStore';
import { scoresFor } from '../lib/scoring';
import { money } from '../lib/specRows';
import { go } from './Bits';
import { Aperture, setIris } from './Chrome';
import { ProductImage } from './ProductImage';
import BlurText from './ui/BlurText';
import CircularGallery from './ui/CircularGallery';
import { photosFor } from './ProductImage';
import { ScoreRoll } from './Bits';
import { searchProducts } from '../lib/search';

const search = (q: string): Product[] => (q.trim() ? searchProducts(products, q) : []);

const SECTION_HERO: Record<Section, string> = { cameras: 'sony-a7iv', action: 'dji-osmo-pocket-3', drones: 'dji-mini-4-pro', gimbals: 'dji-rs-4' };
const QUICK = ['Canon 60D', 'Pocket 4', 'FX3', 'Mini 5 Pro', 'a7 V'];
const STRIP_A = ['sony-a7v', 'canon-r6iii', 'nikon-z6iii', 'fujifilm-xt5', 'panasonic-gh7', 'sony-fx3', 'canon-r5ii', 'nikon-zr', 'fujifilm-x100vi', 'sony-a1ii', 'canon-c80', 'panasonic-s1ii'];
const STRIP_B = ['dji-osmo-pocket-4', 'dji-mini-5-pro', 'gopro-hero13', 'insta360-x6', 'dji-mavic-4-pro', 'dji-rs-5', 'dji-osmo-action-6', 'dji-avata-2', 'insta360-ace-pro-2', 'dji-air-3s', 'dji-osmo-mobile-8p', 'gopro-mission-1-pro'];

function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const f = Math.floor((performance.now() - t0) / (1000 / 24));
      const s = Math.floor(f / 24);
      const p = (n: number) => String(n).padStart(2, '0');
      if (ref.current) ref.current.textContent = `00:${p(Math.floor(s / 60))}:${p(s % 60)}:${p(f % 24)}`;
    }, 1000 / 12);
    return () => clearInterval(id);
  }, []);
  return (
    <span ref={ref} className="tc">
      00:00:00:00
    </span>
  );
}

function Strip({ ids, dir }: { ids: string[]; dir: 1 | -1 }) {
  const items = ids.map((id) => byId(id)).filter((p): p is Product => !!p && !!allSets()[p.id]?.files?.length);
  return (
    <div className={`strip-row ${dir < 0 ? 'rev' : ''}`}>
      <div className="strip-track">
        {[...items, ...items].map((p, i) => (
          <button key={p.id + i} className="frame" onClick={() => go(`/p/${p.id}`)} tabIndex={i >= items.length ? -1 : 0} data-cursor="Open" aria-hidden={i >= items.length}>
            <span className="frame-holes" aria-hidden />
            <ProductImage product={p} size="sm" />
            <span className="frame-cap mono">
              {p.brand} {p.short ?? p.model}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Home() {
  const root = useRef<HTMLElement>(null);
  const [q, setQ] = useState('');
  // the headline focuses in once the logo intro has finished
  const [lit, setLit] = useState(false);
  useEffect(() => whenIntroDone(() => setLit(true)), []);
  const [hi, setHi] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(q).slice(0, 8), [q]);
  const newest = useMemo(() => [...products].sort((a, b) => b.year - a.year || b.price - a.price).slice(0, 8), []);
  const stats = useMemo(() => {
    const modes = products.reduce((n, p) => n + (p.kind === 'gimbal' ? 0 : p.video.modes.length), 0);
    const brands = new Set(products.map((p) => p.brand)).size;
    const years = products.map((p) => p.year);
    return { products: products.length, modes, brands, span: Math.max(...years) - Math.min(...years) + 1 };
  }, []);

  useEffect(() => setHi(0), [q]);
  const open = (p?: Product) => p && go(`/p/${p.id}`);

  useGSAP(
    () => {
      const el = root.current!;
      if (reducedMotion()) return;
      const $ = (s: string) => el.querySelectorAll<HTMLElement>(s);

      /* ── HERO: a cinematic, staged exposure ── */
      const iris = { r: 0, rot: -30 };
      const svg = el.querySelector<SVGSVGElement>('.hero-iris svg');
      const R = 100;
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.expo } });
      tl.from('.vf-corner', { scale: 1.6, autoAlpha: 0, duration: 1.1, stagger: 0.05 }, 0)
        .from('.vf-hud > *', { autoAlpha: 0, y: -8, duration: 0.6, stagger: 0.06 }, 0.2)
        .from(svg, { scale: 0.6, autoAlpha: 0, rotation: -60, duration: 1.6 }, 0)
        .to(iris, { r: 46, rot: 25, duration: 1.8, ease: 'power3.inOut', onUpdate: () => setIris(svg, R, iris.r, iris.rot) }, 0.1)
        .from('.hh-eyebrow', { autoAlpha: 0, letterSpacing: '0.5em', duration: 1.2 }, 0.25)
        .from('.hh-sub', { autoAlpha: 0, y: 18, duration: 0.9 }, 0.75)
        .fromTo('.home-search', { clipPath: 'inset(0 50% 0 50% round 16px)', autoAlpha: 0 }, { clipPath: 'inset(0 0% 0 0% round 16px)', autoAlpha: 1, duration: 1.1, clearProps: 'clipPath' }, 0.85)
        .from('.hs-chips > *', { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.05 }, 1.15)
        .from('.strip-row', { autoAlpha: 0, y: 40, duration: 1.2, stagger: 0.12 }, 0.9);
      whenIntroDone(() => tl.play());

      /* ── FILM STRIPS: endless, react to scroll velocity ── */
      const loops = Array.from($('.strip-track')).map((t, i) => {
        const dir = t.parentElement!.classList.contains('rev') ? 1 : -1;
        return gsap.fromTo(t, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 70 + i * 12, ease: 'none', repeat: -1 });
      });
      let boost: gsap.core.Animation = gsap.to({}, {});
      ScrollTrigger.create({
        trigger: '.film',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 260);
          boost.kill();
          boost = gsap.timeline().to(loops, { timeScale: 1 + Math.abs(v), duration: 0.2 }).to(loops, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
        },
      });
      el.querySelector('.film')?.addEventListener('pointerenter', () => gsap.to(loops, { timeScale: 0.15, duration: 0.6 }));
      el.querySelector('.film')?.addEventListener('pointerleave', () => gsap.to(loops, { timeScale: 1, duration: 0.8 }));

      /* ── STATS: count + sweep ── */
      $('.stat').forEach((s, i) => {
        const n = s.querySelector<HTMLElement>('.stat-num')!;
        const to = Number(n.dataset.to);
        const o = { v: 0 };
        gsap.from(s, { autoAlpha: 0, y: 40, duration: 1, delay: i * 0.08, scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true } });
        gsap.to(o, { v: to, duration: 1.8, delay: i * 0.08, ease: 'power2.out', onUpdate: () => (n.textContent = Math.round(o.v).toLocaleString('en-US')), scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true } });
      });

      /* ── section headings expose as they arrive ── */
      $('.home-h').forEach((h) => {
        SplitText.create(h, { type: 'words', mask: 'words', autoSplit: true, onSplit: (self) => gsap.from(self.words, { yPercent: 110, duration: 1, stagger: 0.06, ease: EASE.expo, scrollTrigger: { trigger: h, start: 'top 88%', once: true } }) });
      });

      /* ── browse tiles: shutter-clip images + stagger ── */
      gsap.from('.home-section', { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.08, ease: EASE.expo, scrollTrigger: { trigger: '.home-sections', start: 'top 85%', once: true } });
      gsap.fromTo('.home-section .pimg', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, stagger: 0.08, ease: EASE.expo, clearProps: 'clipPath', scrollTrigger: { trigger: '.home-sections', start: 'top 85%', once: true } });
      gsap.from('.home-vs .pair', { autoAlpha: 0, x: -20, stagger: 0.06, duration: 0.7, scrollTrigger: { trigger: '.home-vs', start: 'top 85%', once: true } });
      ScrollTrigger.batch('.hn-card', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => {
          gsap.from(els, { autoAlpha: 0, y: 40, duration: 1, stagger: 0.07, ease: EASE.expo });
          gsap.fromTo(els.map((e) => e.querySelector('.pimg')), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.15, stagger: 0.07, ease: EASE.expo, clearProps: 'clipPath' });
        },
      });

      /* ── closing CTA ── */
      const outro = SplitText.create('.outro h2', { type: 'lines', mask: 'lines' });
      gsap.from(outro.lines, { yPercent: 115, duration: 1.2, stagger: 0.1, ease: EASE.expo, scrollTrigger: { trigger: '.outro', start: 'top 80%', once: true } });

      /* ── desktop-only: pinned sensor story, horizontal paths rail, mouse parallax ── */
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        // Sensor story: pin, then scrub crop frame + captions (eased so linear scroll feels physical)
        const story = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: '.story', start: 'top top', end: '+=1800', pin: true, scrub: 0.8, anticipatePin: 1 } });
        story
          .to('.st-crop', { scale: 1 / 1.5, duration: 1 }, 0)
          .to('.st-crop-label', { textContent: '1.5× crop', duration: 0.01 }, 0.5)
          .to('.st-grid i', { autoAlpha: 1, stagger: { each: 0.02, from: 'random' }, duration: 0.3 }, 0.9)
          .to('.st-cap:nth-child(1)', { autoAlpha: 0.18, duration: 0.3 }, 0.9)
          .fromTo('.st-cap:nth-child(2)', { autoAlpha: 0.18 }, { autoAlpha: 1, duration: 0.3 }, 0.9)
          .to('.st-crop', { scale: 1, duration: 1 }, 1.4)
          .to('.st-crop-label', { textContent: 'Full width', duration: 0.01 }, 1.9)
          .to('.st-cap:nth-child(2)', { autoAlpha: 0.18, duration: 0.3 }, 2.1)
          .fromTo('.st-cap:nth-child(3)', { autoAlpha: 0.18 }, { autoAlpha: 1, duration: 0.3 }, 2.1)
          .fromTo('.st-verdict', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 2.2)
          .to('.st-sensor', { rotationY: -14, rotationX: 6, duration: 1.2 }, 1.6);

        // Gear paths rail: vertical scroll drives horizontal travel
        const rail = el.querySelector<HTMLElement>('.paths-track');
        if (rail) {
          gsap.to(rail, {
            x: () => -(rail.scrollWidth - rail.parentElement!.clientWidth),
            ease: 'none',
            scrollTrigger: { trigger: '.paths', start: 'top top', end: () => `+=${rail.scrollWidth - rail.parentElement!.clientWidth}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
          });
        }

        // Hero depth: layers drift with the pointer at different rates
        const hero = el.querySelector<HTMLElement>('.home-hero')!;
        const layers = [
          { el: el.querySelector('.hero-iris'), k: 26 },
          { el: el.querySelector('.hh-copy'), k: -8 },
          { el: el.querySelector('.vf'), k: 6 },
        ].map(({ el: l, k }) => ({ x: gsap.quickTo(l, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(l, 'y', { duration: 1.2, ease: 'power3' }), k }));
        const onMove = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.k);
            l.y(ny * l.k);
          });
        };
        hero.addEventListener('pointermove', onMove);
        // hero exits with depth as you scroll away
        gsap.to('.hero-iris', { yPercent: 30, rotation: 40, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hh-copy', { yPercent: -12, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: '30% top', end: 'bottom top', scrub: true } });
        return () => hero.removeEventListener('pointermove', onMove);
      });
      mm.add('(max-width: 899px), (pointer: coarse)', () => {
        gsap.from('.pt-card', { autoAlpha: 0, y: 30, stagger: 0.08, duration: 0.8, ease: EASE.expo, scrollTrigger: { trigger: '.paths', start: 'top 85%', once: true } });
        gsap.from('.st-cap', { autoAlpha: 0, y: 20, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: '.story', start: 'top 80%', once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="home" ref={root} data-bespoke>
      {/* ═════════ HERO ═════════ */}
      <div className="home-hero">
        <div className="vf" aria-hidden>
          <span className="vf-corner tl" />
          <span className="vf-corner tr" />
          <span className="vf-corner bl" />
          <span className="vf-corner br" />
          <div className="vf-hud mono">
            <span className="rec">
              <i /> REC
            </span>
            <Timecode />
            <span>4K · 23.98p</span>
            <span>ISO 800 · ƒ/1.8</span>
          </div>
        </div>
        <div className="hero-iris" aria-hidden>
          <Aperture />
        </div>

        <div className="hh-copy">
          <span className="eyebrow hh-eyebrow">The camera & drone decision engine</span>
          <h1 className="hh-title">
            {/* words pull into focus like a lens racking in: short, small travel, no bounce */}
            {(
              [
                ['Find any camera,', 0.3, ''],
                ['drone or gimbal.', 0.45, ''],
                ['Compare. Decide.', 0.66, 'grad'],
              ] as const
            ).map(([text, start, cls]) => (
              <BlurText key={text} as="span" className="hh-bline" text={text} play={lit} start={start} effect="focus" delay={55} stepDuration={0.3} blur={6} pieceClassName={cls} />
            ))}
          </h1>
          <p className="hh-sub muted">{products.length} products — every video mode, crop and frame rate, scored and compared head to head.</p>

          <div className="home-search">
            <span className="hs-icon" aria-hidden>
              ⌕
            </span>
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any camera, drone or gimbal…"
              aria-label="Search products"
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHi((h) => Math.min(h + 1, results.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHi((h) => Math.max(h - 1, 0));
                } else if (e.key === 'Enter') open(results[hi]);
                else if (e.key === 'Escape') setQ('');
              }}
            />
            {q && (
              <button className="hs-clear" onClick={() => setQ('')} aria-label="Clear search">
                ×
              </button>
            )}
            {q && (
              <div className="hs-results" role="listbox">
                {results.map((p, i) => (
                  <button key={p.id} role="option" aria-selected={i === hi} className={`hs-row ${i === hi ? 'on' : ''}`} onMouseEnter={() => setHi(i)} onClick={() => open(p)} style={{ ['--i' as string]: i }}>
                    <ProductImage product={p} size="sm" />
                    <span className="hs-main">
                      <span className="muted small">
                        {p.brand} · {SECTION_INFO[sectionOf(p)].noun}
                      </span>
                      <b>{p.model}</b>
                    </span>
                    <span className="hs-meta">
                      <b>{money(p.price)}</b>
                      <span className="muted small">{p.year}</span>
                    </span>
                  </button>
                ))}
                {!results.length && <p className="muted small hs-none">Nothing matches “{q}”. Try a brand or model number.</p>}
              </div>
            )}
          </div>
          <div className="hs-chips">
            <span className="muted small">Try</span>
            {QUICK.map((t) => (
              <button
                key={t}
                className="hs-chip"
                onClick={() => {
                  setQ(t);
                  input.current?.focus();
                }}
              >
                {t}
              </button>
            ))}
            <button className="hs-chip hs-finder" onClick={() => go('/finder')}>
              Not sure? Take the gear finder quiz →
            </button>
          </div>
        </div>
      </div>

      {/* ═════════ FILM STRIPS ═════════ */}
      <div className="film" aria-label="Featured products">
        <Strip ids={STRIP_A} dir={1} />
        <Strip ids={STRIP_B} dir={-1} />
      </div>

      {/* ═════════ STATS ═════════ */}
      <div className="stats">
        {[
          [stats.products, 'products scored'],
          [stats.modes, 'video modes mapped'],
          [stats.brands, 'brands'],
          [stats.span, 'years of gear'],
        ].map(([n, l]) => (
          <div key={l} className="stat">
            <span className="stat-num" data-to={n}>
              {Number(n).toLocaleString('en-US')}
            </span>
            <span className="muted small">{l}</span>
          </div>
        ))}
      </div>

      {/* ═════════ PINNED SENSOR STORY ═════════ */}
      <div className="story">
        <div className="st-copy">
          <span className="eyebrow">How we read a spec sheet</span>
          <div className="st-caps">
            <p className="st-cap">
              <b>Every resolution.</b> 8K to 1080p, every frame rate a camera can actually record internally.
            </p>
            <p className="st-cap">
              <b>Every crop.</b> 4K60 that quietly crops 1.5× isn’t the same as full-width 4K60. We show the difference.
            </p>
            <p className="st-cap">
              <b>A straight answer.</b> Upgrade, sidegrade or skip — scored with weights you can inspect.
            </p>
          </div>
          <div className="st-verdict">
            <span className="mono small muted">a7 III → a7 V</span>
            <b>Strong upgrade — go for it</b>
          </div>
        </div>
        <div className="st-visual" aria-hidden>
          <div className="st-sensor">
            <div className="st-grid">
              {Array.from({ length: 48 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="st-crop">
              <span className="st-crop-label mono">Full width</span>
            </div>
            <span className="st-tag mono">36 × 24 mm sensor</span>
          </div>
        </div>
      </div>

      {/* ═════════ THE LINE-UP (curved gallery) ═════════ */}
      <Lineup />

      {/* ═════════ BROWSE ═════════ */}
      <h2 className="home-h">Browse the catalogue</h2>
      <div className="home-sections">
        {(['cameras', 'action', 'drones', 'gimbals'] as Section[]).map((s) => {
          const hero = byId(SECTION_HERO[s]);
          return (
            <button key={s} className="home-section" onClick={() => go(`/${s}`)} data-cursor="Browse">
              <span className="hsec-text">
                <b>{SECTION_INFO[s].title}</b>
                <span className="muted small">
                  {inSection(s).length} models · {brandsIn(s).length} brands
                </span>
                <span className="hsec-go">Explore →</span>
              </span>
              {hero && <ProductImage product={hero} size="sm" />}
            </button>
          );
        })}
      </div>

      {/* ═════════ GEAR PATHS RAIL ═════════ */}
      <div className="paths">
        <div className="paths-head">
          <span className="eyebrow">Gear paths</span>
          <h2>From your first camera to world-class.</h2>
          <p className="muted">Complete kits for every level — with cheap used options for tight budgets.</p>
          <span className="paths-hint" aria-hidden>
            Swipe to see all {TRACKS.length} paths →
          </span>
        </div>
        <div className="paths-viewport">
          <div className="paths-track">
            {TRACKS.map((t, i) => (
              <button key={t.key} className="pt-card" onClick={() => go(`/kits/${t.key}/beginner`)} data-cursor="Open">
                <span className="pt-num mono">0{i + 1}</span>
                <span className="pt-icon" aria-hidden>
                  {t.icon}
                </span>
                <b>{t.label}</b>
                <span className="muted">{t.blurb}</span>
                <span className="pt-tiers">
                  {TIERS.map((x) => (
                    <span key={x.key} title={x.label}>
                      {x.icon}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═════════ VERSUS + NEWEST ═════════ */}
      <div className="home-split">
        <div className="panel home-vs" data-bespoke>
          <span className="eyebrow">Versus</span>
          <h2>Should you upgrade?</h2>
          <div className="hv-pairs">
            {[
              ['canon-60d', 'canon-r50', 'From a classic 60D'],
              ['sony-a7iii', 'sony-a7v', 'a7 III → a7 V'],
              ['dji-osmo-pocket-3', 'dji-osmo-pocket-4', 'Pocket 3 → Pocket 4'],
              ['gopro-hero13', 'dji-osmo-action-6', 'HERO13 vs Action 6'],
              ['dji-mini-4-pro', 'dji-mini-5-pro', 'Mini 4 Pro → Mini 5 Pro'],
            ].map(([a, b, l]) => (
              <button key={a + b} className="pair" onClick={() => go(`/vs/${a}/${b}`)}>
                {l}
                <small className="muted mono">
                  {scoresFor(byId(a)!).overall} → {scoresFor(byId(b)!).overall}
                </small>
              </button>
            ))}
          </div>
          <button className="btn" onClick={() => go('/vs')}>
            Open Versus →
          </button>
        </div>
        <div className="home-new-wrap">
          <h2 className="home-h">Newest arrivals</h2>
          <div className="home-new">
            {newest.map((p) => (
              <button key={p.id} className="hn-card" onClick={() => go(`/p/${p.id}`)} data-cursor="View">
                <ProductImage product={p} size="sm" />
                <span className="muted small mono">
                  {p.brand} · {p.year}
                </span>
                <b>{p.model}</b>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═════════ OUTRO ═════════ */}
      <div className="outro">
        <h2>
          Know exactly what
          <br />
          you’re buying.
        </h2>
        <button
          className="btn big"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
            setTimeout(() => input.current?.focus(), 500);
          }}
        >
          Search the catalogue
        </button>
      </div>
    </section>
  );
}

/* ── The line-up: this year's headline gear on a slow curved gallery. Drag / swipe / arrow keys. ── */
const LINEUP = ['sony-a1ii', 'canon-r5ii', 'nikon-z8', 'fujifilm-x100vi', 'panasonic-gh7', 'sony-fx3', 'canon-c80', 'nikon-z6iii', 'dji-mavic-4-pro', 'dji-mini-5-pro', 'dji-osmo-pocket-4', 'insta360-x6', 'gopro-hero13', 'dji-rs-5'];

/** WebGL needs CORS-clean images: hotlinked photos go through a public image relay. */
function relay(src: string): string {
  if (!/^https?:/.test(src)) return src; // bundled photo, same origin
  return `https://images.weserv.nl/?url=${encodeURIComponent(src)}&trim=12&w=900&output=jpg&bg=ffffff&q=86`; // trim: crop away the retailer's empty margins
}

/**
 * Re-shoot each photo on the site's studio backdrop (the same soft white-to-grey sweep as every product tile),
 * centred with even padding, so the gallery reads as one consistent set instead of mismatched retailer crops.
 */
function studioShot(src: string): Promise<string> {
  const shot = new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const W = 1200;
      const H = 900;
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, Math.hypot(W, H) * 0.55);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.78, '#dfe3e9');
      g.addColorStop(1, '#d6dbe2');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const k = Math.min((W * 0.74) / img.naturalWidth, (H * 0.7) / img.naturalHeight);
      const w = img.naturalWidth * k;
      const h = img.naturalHeight * k;
      ctx.globalCompositeOperation = 'multiply'; // white product backgrounds melt into the sweep
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2 + H * 0.02, w, h);
      c.toBlob((b) => resolve(b ? URL.createObjectURL(b) : src), 'image/jpeg', 0.9);
    };
    img.onerror = () => resolve('');
    img.src = relay(src);
  });
  // never leave the gallery waiting on one slow photo: after 9 s it's simply left out
  return Promise.race([shot, new Promise<string>((r) => setTimeout(() => r(''), 9000))]);
}

function Lineup() {
  const items = useMemo(() => LINEUP.map((id) => byId(id)).filter((p): p is Product => !!p && !!photosFor(p.id).length), []);
  const [gallery, setGallery] = useState<{ image: string; alt: string }[] | null>(null);
  const [shown, setShown] = useState<Product[]>(items); // the products whose photo made it
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  // only fetch the photos once the section is close to the screen
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!near) return;
    let live = true;
    const made: string[] = [];
    Promise.all(items.map((p) => studioShot(photosFor(p.id)[0]))).then((urls) => {
      made.push(...urls.filter((u) => u.startsWith('blob:')));
      if (!live) return;
      const ok = items.map((p, i) => ({ p, image: urls[i] })).filter((x) => x.image);
      setShown(ok.map((x) => x.p));
      setGallery(ok.map(({ p, image }) => ({ image, alt: `${p.brand} ${p.model}` })));
    });
    return () => {
      live = false;
      made.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [items, near]);
  const [active, setActive] = useState(0);
  // phones: bigger cards so the photo, not the empty stage, fills the width
  const narrow = typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches;
  const list = shown.length ? shown : items;
  const p = list[((active % list.length) + list.length) % list.length];
  if (!p) return null;
  return (
    <section className="lineup" aria-label="The line-up">
      <div className="lineup-head">
        <span className="eyebrow">The line-up</span>
        <h2 className="home-h">This year’s headline gear.</h2>
      </div>
      <div className="lineup-stage" ref={stage}>
        {gallery && (
        <CircularGallery
          items={gallery}
          bend={1.6}
          itemAspect={1.333}
          itemSize={narrow ? 1.5 : 0.92}
          gap={0.2}
          wave={0.25}
          borderRadius={0.035}
          fadeEdges={0.2}
          shadow={0.45}
          scrollEase={0.07}
          showTitles={false}
          openOnClick={false}
          textColor="#eceef2"
          font="600 20px 'Space Grotesk'"
          onActiveChange={setActive}
          onItemClick={(_, i) => go(`/p/${list[i % list.length].id}`)}
        />
        )}
      </div>
      <button className="lineup-caption" key={p.id} onClick={() => go(`/p/${p.id}`)}>
        <span className="lc-meta mono">
          {String(list.indexOf(p) + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')} · {p.brand} · {p.year}
        </span>
        <b className="lc-name">{p.model}</b>
        <span className="lc-score">
          <ScoreRoll value={scoresFor(p).overall} duration={0.8} />
          <small>overall</small>
        </span>
        <span className="lc-price">{money(p.price)}</span>
        <span className="lc-open">View specs →</span>
      </button>
      <p className="lineup-hint muted small">
        <span className="lh-fine">Drag or use ← → to turn the line-up</span>
        <span className="lh-touch">Swipe to turn the line-up</span>
      </p>
    </section>
  );
}
