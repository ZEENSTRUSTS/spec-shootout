import { memo, useEffect, useMemo, useState } from 'react';
import { brandsIn, inSection, SECTION_INFO, type Section } from '../data';
import type { Product } from '../data/types';
import { canShoot, scoresFor, videoStats, resLabel } from '../lib/scoring';
import { money } from '../lib/specRows';
import { CountUp, go, ScoreBars } from './Bits';
import { BrandLogo, BRAND_COLOR, BRAND_TAGLINE } from './BrandLogo';
import { ProductImage } from './ProductImage';
import { observeReveal } from '../lib/motion';

type Sort = 'overall' | 'newest' | 'oldest' | 'price-asc' | 'price-desc' | `bar:${number}`;

export function chips(p: Product): string[] {
  if (p.kind === 'gimbal') {
    return [p.cls === 'Phone' ? 'Phone' : 'Camera', p.payload < 1 ? `${Math.round(p.payload * 1000)} g load` : `${p.payload} kg load`, `${p.battery} h`, `${p.weight} g`];
  }
  const vs = videoStats(p.video.modes);
  if (p.kind === 'camera') {
    const size = { 'Full Frame': 'FF', 'Micro Four Thirds': 'MFT', 'Medium Format': 'MF', 'Super 35': 'S35' }[p.sensor.size as string] ?? p.sensor.size;
    const stab = p.stab === 'gimbal' ? 'Gimbal' : p.stab === 'eis' ? 'EIS' : p.ibis ? `IBIS ${p.ibis.stops}` : 'No IBIS';
    return [`${p.sensor.mp}MP ${size}`, stab, `${resLabel(vs.maxWidth)}${p.video.intRaw ? ' RAW' : ''}`, p.waterproof ? `${p.waterproof} m WP` : p.photo.eFps ? `${Math.max(p.photo.eFps, p.photo.mechFps ?? 0)} fps` : `${vs.any4k ? `4K${vs.any4k}` : resLabel(vs.maxWidth)}`];
  }
  return [`${p.cameras[0].sensor}`, `${p.cameras.length} cam`, `${p.flight.time} min`, p.flight.sub250 ? '<250 g' : `${p.flight.weight} g`];
}

const ERAS: [string, number, number][] = [
  ['Any year', 0, 9999],
  ['2008–14', 2008, 2014],
  ['2015–19', 2015, 2019],
  ['2020–22', 2020, 2022],
  ['2023+', 2023, 9999],
];
const TYPES: Record<Section, string[]> = {
  cameras: ['All', 'Mirrorless', 'DSLR', 'Cinema', 'Compact'],
  action: ['All', 'Action', '360', 'Pocket gimbal'],
  drones: [],
  gimbals: ['All', 'Camera', 'Phone'],
};
const PRICES = [0, 100, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000, 20000];
const RATES = [24, 25, 30, 48, 50, 60, 100, 120, 180, 240];
const TIERS: [string, string][] = [
  ['any', 'Any resolution'],
  ['FHD', '1080p'],
  ['4K', '4K or higher'],
  ['5K-6K', '5K / 6K or higher'],
  ['8K', '8K'],
];

function load<T>(key: string, fallback: T): T {
  try {
    const v = sessionStorage.getItem(key);
    return v ? { ...fallback, ...(JSON.parse(v) as T) } : fallback;
  } catch {
    return fallback;
  }
}

const typeOf = (p: Product) => (p.kind === 'camera' ? p.type : p.kind === 'gimbal' ? p.cls : '');

export function Browse({ section, compare, toggleCompare }: { section: Section; compare: string[]; toggleCompare: (id: string) => void }) {
  const k = `browse2-${section}`;
  const all = useMemo(() => inSection(section), [section]);
  const saved = load(k, { q: '', brand: 'All', type: 'All', era: 0, sort: 'overall' as Sort, tier: 'any', fps: 0, uncropped: false, lo: 0, hi: PRICES.length - 1, finder: false });
  const [q, setQ] = useState(saved.q);
  const [brand, setBrand] = useState(saved.brand);
  const [type, setType] = useState(saved.type);
  const [era, setEra] = useState(saved.era);
  const [sort, setSort] = useState<Sort>(saved.sort);
  const [tier, setTier] = useState(saved.tier);
  const [fps, setFps] = useState(saved.fps);
  const [uncropped, setUncropped] = useState(saved.uncropped);
  const [lo, setLo] = useState(saved.lo);
  const [hi, setHi] = useState(saved.hi);
  const [finder, setFinder] = useState(saved.finder);
  const brands = brandsIn(section);
  const info = SECTION_INFO[section];
  const filmable = section !== 'gimbals';
  const barNames = all.length ? scoresFor(all[0]).bars.map(([l]) => l).filter((l) => l !== 'Overall') : [];

  useEffect(() => {
    try {
      sessionStorage.setItem(k, JSON.stringify({ q, brand, type, era, sort, tier, fps, uncropped, lo, hi, finder }));
    } catch {
      /* storage unavailable */
    }
  }, [k, q, brand, type, era, sort, tier, fps, uncropped, lo, hi, finder]);

  const finderOn = filmable && (fps > 0 || tier !== 'any');
  const minP = PRICES[lo];
  const maxP = hi >= PRICES.length - 1 ? Infinity : PRICES[hi];

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const [, from, to] = ERAS[era];
    const items = all
      .filter(
        (p) =>
          (brand === 'All' || p.brand === brand) &&
          (type === 'All' || typeOf(p) === type) &&
          p.year >= from &&
          p.year <= to &&
          p.price >= minP &&
          p.price <= maxP &&
          (!needle || `${p.brand} ${p.model} ${p.segment} ${p.short}`.toLowerCase().includes(needle)),
      )
      .map((p) => {
        let match: ReturnType<typeof canShoot> = null;
        if (finderOn && p.kind !== 'gimbal') {
          if (fps) match = canShoot(p, tier, fps);
          else
            for (const f of new Set(p.video.modes.flatMap((m) => m.fps))) {
              const hit = canShoot(p, tier, f);
              if (hit && (!match || hit.crop < match.crop)) match = hit;
            }
        }
        return { p, match };
      })
      .filter(({ match }) => !finderOn || (match && (!uncropped || match.crop <= 1.05)));
    const key = (p: Product) => {
      const s = scoresFor(p);
      if (sort.startsWith('bar:')) return -s.bars[Number(sort.slice(4))][1];
      switch (sort) {
        case 'price-asc':
          return p.price;
        case 'price-desc':
          return -p.price;
        case 'newest':
          return -p.year;
        case 'oldest':
          return p.year;
        default:
          return -s.overall;
      }
    };
    return items.sort((a, b) => key(a.p) - key(b.p));
  }, [all, q, brand, type, era, sort, tier, fps, uncropped, minP, maxP, finderOn]);

  // Progressive rendering: paint the first screenful immediately, then add the rest in small
  // batches between frames so a 250-card section never blocks the page (or its entrance animation).
  const FIRST = 24;
  const listKey = useMemo(() => list.map((x) => x.p.id).join(','), [list]);
  const [shown, setShown] = useState(FIRST);
  useEffect(() => {
    setShown(FIRST);
    if (list.length <= FIRST) return;
    let n = FIRST;
    let timer = 0;
    const step = () => {
      n = Math.min(n + 12, list.length);
      setShown(n);
      if (n < list.length) timer = window.setTimeout(step, 16);
    };
    timer = window.setTimeout(step, 600); // after the page entrance has finished
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey]);

  const reset = () => {
    setQ('');
    setBrand('All');
    setType('All');
    setEra(0);
    setTier('any');
    setFps(0);
    setUncropped(false);
    setLo(0);
    setHi(PRICES.length - 1);
  };
  const dirty = finderOn || brand !== 'All' || type !== 'All' || era || q || lo || hi !== PRICES.length - 1;
  const tierName = TIERS.find(([t]) => t === tier)?.[1] ?? '';
  const color = brand === 'All' ? 'var(--accent)' : BRAND_COLOR[brand] ?? 'var(--accent)';
  const years = all.map((p) => p.year);
  const brandCount = brand === 'All' ? all.length : all.filter((p) => p.brand === brand).length;

  return (
    <section>
      {/* ── hero: switches to the brand's logo when a brand is picked ── */}
      <div className="hero" style={{ ['--brand' as string]: color }}>
        <div className="hero-glow" key={`glow-${brand}`} />
        {brand === 'All' ? (
          <div className="hero-text" key="all">
            <span className="eyebrow">
              {all.length} {info.plural} · {brands.length} brand{brands.length > 1 ? 's' : ''} · {Math.min(...years)} → today
            </span>
            <h1>
              {section === 'cameras' && (
                <>
                  Find the camera that <span className="grad">shoots the way you do.</span>
                </>
              )}
              {section === 'action' && (
                <>
                  Pocket, action & <span className="grad">360° cameras.</span>
                </>
              )}
              {section === 'drones' && (
                <>
                  Pick the drone that <span className="grad">fits your flying.</span>
                </>
              )}
              {section === 'gimbals' && (
                <>
                  Smooth shots, <span className="grad">from phone to cinema.</span>
                </>
              )}
            </h1>
            <p className="muted">
              {section === 'gimbals'
                ? 'DJI, Zhiyun, Moza, FeiyuTech, Hohem and Insta360 gimbals for phones, mirrorless and cinema rigs — payload, battery, tracking and focus control compared.'
                : 'Every resolution and frame rate each one records, the crop at each, and a straight answer on whether to upgrade.'}
            </p>
          </div>
        ) : (
          <div className="brand-hero" key={brand}>
            <BrandLogo brand={brand} size="xl" />
            <div className="brand-hero-text">
              <p className="muted">{BRAND_TAGLINE[brand]}</p>
              <span className="eyebrow">
                <CountUp value={brandCount} /> {info.plural} in this lineup
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── brand picker ── */}
      <div className="brand-row">
        <button className={`brand-chip ${brand === 'All' ? 'on' : ''}`} onClick={() => setBrand('All')}>
          <span className="brand-chip-all">All brands</span>
        </button>
        {brands.map((b) => (
          <button key={b} className={`brand-chip ${brand === b ? 'on' : ''}`} style={{ ['--brand' as string]: BRAND_COLOR[b] }} onClick={() => setBrand(b)} title={b}>
            <BrandLogo brand={b} size="sm" />
          </button>
        ))}
      </div>

      {/* ── filter bar ── */}
      <div className="filterbar glass">
        <input className="search" placeholder={`Search ${info.plural}…`} value={q} onChange={(e) => setQ(e.target.value)} />
        {TYPES[section].length > 0 && (
          <div className="seg">
            {TYPES[section].map((t) => (
              <button key={t} className={type === t ? 'on' : ''} onClick={() => setType(t)}>
                {t}
              </button>
            ))}
          </div>
        )}
        <div className="budget">
          <div className="budget-label">
            <span>Budget</span>
            <b>
              {money(minP)} – {maxP === Infinity ? 'any' : money(maxP)}
            </b>
          </div>
          <div className="range2" style={{ ['--lo' as string]: lo / (PRICES.length - 1), ['--hi' as string]: hi / (PRICES.length - 1) }}>
            <div className="range2-track" />
            <input type="range" min={0} max={PRICES.length - 1} value={lo} aria-label="Minimum price" onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 1))} />
            <input type="range" min={0} max={PRICES.length - 1} value={hi} aria-label="Maximum price" onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 1))} />
          </div>
        </div>
        <div className="seg">
          {ERAS.map(([l], i) => (
            <button key={l} className={era === i ? 'on' : ''} onClick={() => setEra(i)}>
              {l}
            </button>
          ))}
        </div>
        <label className="sort">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="overall">Overall score</option>
            {barNames.map((b, i) => (
              <option key={b} value={`bar:${i}`}>
                {b} score
              </option>
            ))}
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
          </select>
        </label>
      </div>

      {/* ── advanced: frame-rate finder ── */}
      {filmable && (
        <div className={`finder ${finder ? 'open' : ''}`}>
          <button className="finder-toggle" onClick={() => setFinder(!finder)} aria-expanded={finder}>
            <span className="finder-icon">⏱</span>
            <span>
              <b>Frame-rate finder</b>
              <span className="muted small"> — only show {info.plural} that can record exactly what you shoot</span>
            </span>
            {finderOn && <span className="pill-on">On</span>}
            <span className="chev">⌄</span>
          </button>
          <div className="finder-body">
            <div className="finder-row">
              <label>
                I shoot
                <select value={tier} onChange={(e) => setTier(e.target.value)}>
                  {TIERS.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                at
                <select value={fps} onChange={(e) => setFps(Number(e.target.value))}>
                  <option value={0}>any frame rate</option>
                  {RATES.map((r) => (
                    <option key={r} value={r}>
                      {r}p{r === 24 ? ' (cinematic)' : r === 25 ? ' (PAL)' : r === 30 ? ' (NTSC)' : r >= 100 ? ' (slow-mo)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              {section !== 'drones' && (
                <label className="check">
                  <input type="checkbox" checked={uncropped} onChange={(e) => setUncropped(e.target.checked)} />
                  Uncropped only
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="result-row">
        <p className="muted small">
          Showing <b className="text">{list.length}</b> of {all.length}
          {finderOn && ` that can shoot ${tierName.toLowerCase()}${fps ? ` at ${fps}p` : ''}${uncropped ? ' without a crop' : ''}`}
        </p>
        {dirty ? (
          <button className="link" onClick={reset}>
            Reset filters
          </button>
        ) : null}
      </div>

      <div className="grid" key={`${brand}-${type}-${era}-${sort}`}>
        {list.slice(0, shown).map(({ p, match }, i) => (
          <Card key={p.id} p={p} i={i} match={finderOn && fps > 0 ? match : null} fps={fps} picked={compare.includes(p.id)} toggle={() => toggleCompare(p.id)} />
        ))}
        {!list.length && (
          <div className="empty panel">
            <p>Nothing matches those filters.</p>
            <button className="btn" onClick={reset}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Memoised so progressive rendering only renders the new cards, not every card already on screen.
 * `toggle` is ignored in the comparison: it always calls the (functional-update) compare setter for this id.
 */
const Card = memo(CardView, (a, b) => a.p === b.p && a.i === b.i && a.match === b.match && a.fps === b.fps && a.picked === b.picked);

function CardView({ p, i, match, fps, picked, toggle }: { p: Product; i: number; match: ReturnType<typeof canShoot>; fps: number; picked: boolean; toggle: () => void }) {
  const typeLabel = p.kind === 'camera' ? p.type : p.kind === 'gimbal' ? `${p.cls} gimbal` : p.segment;
  return (
    <article ref={observeReveal} className={`card ${picked ? 'picked' : ''}`} style={{ ['--brand' as string]: BRAND_COLOR[p.brand] }} data-i={i} data-cursor="View">
      <button className="card-main" onClick={() => go(`/p/${p.id}`)} aria-label={`Open ${p.brand} ${p.model}`}>
        <div className="card-img">
          <ProductImage product={p} />
          <span className="year-badge">{p.year}</span>
          <span className="type-badge">{typeLabel}</span>
          {match && (
            <span className={`match-badge ${p.kind === 'drone' || match.crop <= 1.05 ? 'full' : 'crop'}`}>
              {fps}p {p.kind === 'drone' || match.crop <= 1.05 ? '✓ full width' : `${match.crop}× crop`}
            </span>
          )}
        </div>
        <div className="card-head">
          <div>
            <div className="brand">{p.brand}</div>
            <h3>{p.model}</h3>
          </div>
          <div className="price">{money(p.price)}</div>
        </div>
        <div className="tags">
          {[...new Set(chips(p))].map((c) => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
        </div>
        <ScoreBars product={p} compact />
        
      </button>
      <label className="cmp-check">
        <input type="checkbox" checked={picked} onChange={toggle} />
        {picked ? 'In comparison' : 'Compare'}
      </label>
    </article>
  );
}
