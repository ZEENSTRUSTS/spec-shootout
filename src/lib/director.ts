/**
 * The motion director: runs once per page mount (inside <Page>'s useGSAP context, so everything it
 * creates — tweens, SplitTexts, ScrollTriggers — is reverted automatically when the page unmounts).
 *
 * Different kinds of content get different, deliberate treatments instead of one generic fade:
 *  - headlines expose line-by-line through a mask (like film exposure)
 *  - product imagery is unveiled by a vertical "shutter" clip with a lens-settle scale
 *  - scores fill when they enter the viewport; numbers count; grids sweep in on a diagonal
 *  - panels rise with weight; lists cascade; the Versus duel enters from opposing sides
 * Pages with a bespoke intro (Home) mark their root with [data-bespoke] and skip the generic hero.
 */
import { countTo, DESKTOP, EASE, gsap, ScrollTrigger, SplitText } from './motion';

const once = (trigger: Element, start = 'top 88%') => ({ trigger, start, once: true });

export function direct(root: HTMLElement) {
  const q = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T & HTMLElement>(sel));
  const bespoke = !!root.querySelector('[data-bespoke]');

  /* 1 ── headline exposure: masked line reveal */
  if (!bespoke) {
    const heads = q('.hero-text h1, .brand-hero-text h1, .detail-title, .kit-head h2, .home-h');
    heads.forEach((h, i) => {
      SplitText.create(h, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 115, duration: 1.05, ease: EASE.expo, stagger: 0.09, delay: 0.08 + i * 0.05, scrollTrigger: h.classList.contains('home-h') ? once(h) : undefined }),
      });
    });
    const intro = q('.hero-text > :not(h1), .brand-hero-text > :not(h1), .detail-info .meta, .detail-info .verify');
    if (intro.length) gsap.from(intro, { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.07, delay: 0.32 });
    q('.eyebrow').forEach((e) => gsap.from(e, { autoAlpha: 0, letterSpacing: '0.45em', duration: 1.1, ease: EASE.expo, delay: 0.05 }));
    q('.brand-hero .logo-xl, .brand-hero .wordmark-xl').forEach((l) => gsap.from(l, { autoAlpha: 0, scale: 0.86, y: 12, duration: 1, ease: EASE.expo }));
  }

  /* 2 ── product imagery: shutter-clip unveil + lens settle */
  q('.detail-img .gallery, .detail-img > :first-child').slice(0, 1).forEach((wrap) => {
    gsap.fromTo(wrap, { clipPath: 'inset(50% 0% 50% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.expo, delay: 0.1, clearProps: 'clipPath' });
    const img = wrap.querySelector('img');
    if (img) gsap.from(img, { scale: 1.18, duration: 1.6, ease: EASE.expo, delay: 0.1, clearProps: 'transform' });
  });
  q('.facts .fact').length && gsap.from(q('.facts .fact'), { autoAlpha: 0, y: 16, duration: 0.6, stagger: { each: 0.045, from: 'start' }, delay: 0.45 });
  q('.score-panel, .upgrade-box').forEach((el, i) => gsap.from(el, { autoAlpha: 0, y: 20, duration: 0.8, delay: 0.35 + i * 0.15 }));

  /* 3 ── Versus duel: opposing entrances, badge lands last */
  const cards = q('.vs-card');
  if (cards.length) {
    const tl = gsap.timeline({ delay: 0.1 });
    cards.forEach((c, i) => {
      // straight fade-up (no tilt, no sideways slide); transforms are cleared so cards always end level
      tl.from(c, { autoAlpha: 0, y: 24, duration: 0.8, ease: EASE.expo, clearProps: 'transform' }, i * 0.08);
      const img = c.querySelector('.pimg');
      if (img) tl.fromTo(img, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: EASE.expo, clearProps: 'clipPath' }, i * 0.08 + 0.15);
    });
    q('.vs-badge').forEach((b) => tl.from(b, { scale: 0.6, autoAlpha: 0, duration: 0.5, ease: EASE.out, clearProps: 'transform' }, 0.4));
    q('.verdict').forEach((v) => tl.from(v, { autoAlpha: 0, y: 30, scale: 0.97, duration: 0.9, ease: EASE.expo }, 0.6));
    q('.verdict .gains li, .verdict .losses li').length && tl.from(q('.verdict .gains li, .verdict .losses li'), { autoAlpha: 0, x: -14, stagger: 0.05, duration: 0.5 }, 0.95);
    q('.vs-pick .vs-side').length && gsap.from(q('.vs-pick .vs-side'), { autoAlpha: 0, y: 16, stagger: 0.06, duration: 0.6, delay: 0.2 });
  }

  /* 4 ── panels rise with weight as they enter (skip ones animated elsewhere, so no two tweens fight) */
  const LISTS = ['.highlights', '.rank-list', '.pairs', '.alts', '.ks-options', '.kit-slots', '.kit-tracks', '.kit-tiers', '.factors-grid', '.multi-scores', '.notes', '.mode-list', '.vs-modes'];
  q('.panel').forEach((p) => {
    if (p.closest('[data-bespoke]') || p.classList.contains('verdict')) return;
    if (p.parentElement && LISTS.some((sel) => p.parentElement!.matches(sel))) return;
    gsap.from(p, { autoAlpha: 0, y: 46, duration: 1, ease: EASE.expo, scrollTrigger: once(p, 'top 92%') });
  });

  /* 5 ── score bars + duel bars fill when seen (scaleX: compositor-only) */
  const bars = q('.bar-fill, .dfill').filter((b) => !b.closest('.card'));
  ScrollTrigger.batch(bars, {
    start: 'top 94%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1.2, ease: EASE.expo, stagger: 0.04 }),
  });
  gsap.set(bars, { scaleX: 0, transformOrigin: 'left center' });
  ScrollTrigger.batch(q('.ms-row, .duel-row'), { start: 'top 94%', once: true, onEnter: (els) => gsap.from(els, { autoAlpha: 0, x: -10, stagger: 0.035, duration: 0.5 }) });

  /* 6 ── frame-rate matrices sweep in on a diagonal, cell by cell */
  q('table.matrix').forEach((t) => {
    const cells = t.querySelectorAll('td.cell, td.dm-cell');
    if (!cells.length) return;
    gsap.from(cells, {
      autoAlpha: 0,
      scale: 0.55,
      duration: 0.45,
      ease: 'power2.out',
      stagger: { each: 0.006, from: 'start' },
      scrollTrigger: once(t, 'top 90%'),
    });
  });

  /* 7 ── cascading lists (each list cascades on its own when it enters) */
  LISTS.forEach((sel) =>
    q(sel).forEach((list) => {
      if (list.closest('[data-bespoke]')) return;
      const items = Array.from(list.children) as HTMLElement[];
      if (!items.length) return;
      gsap.from(items, { autoAlpha: 0, y: 22, duration: 0.7, ease: EASE.expo, stagger: 0.05, scrollTrigger: once(list, 'top 90%') });
    }),
  );

  /* 8 ── numbers marked with data-count count up when seen */
  q('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const from = Number(el.dataset.from ?? 0);
    const money = el.dataset.format === 'money';
    const fmt = money ? (n: number) => '$' + Math.round(n).toLocaleString('en-US') : undefined;
    ScrollTrigger.create({ ...once(el, 'top 95%'), onEnter: () => countTo(el, to, { from, format: fmt, duration: 1.3 }) });
  });

  /* 9 ── desktop-only depth: hero glow drifts against scroll */
  const mm = gsap.matchMedia();
  mm.add(DESKTOP, () => {
    q('.hero-glow').forEach((g) => gsap.to(g, { yPercent: 40, ease: 'none', scrollTrigger: { trigger: g.parentElement!, start: 'top top', end: 'bottom top', scrub: true } }));
  });

  // content heights change as images load — keep trigger positions honest
  let t = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(t);
    t = window.setTimeout(() => ScrollTrigger.refresh(), 180);
  });
  ro.observe(root);
  return () => {
    ro.disconnect();
    clearTimeout(t);
    mm.revert();
  };
}
