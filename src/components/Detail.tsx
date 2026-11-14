import { useState } from 'react';
import { products, sectionOf } from '../data';
import type { Filmable, Product } from '../data/types';
import { scoresFor, videoStats, resLabel, type Factor } from '../lib/scoring';
import { money, specFor } from '../lib/specRows';
import { Bar, CAT_COLOR, FormatList, FrameRateMatrix, go, ScoreBars, ScoreRing } from './Bits';
import { BrandLogo, BRAND_COLOR } from './BrandLogo';
import { creditFor, photosFor, ProductImage } from './ProductImage';
import { usePhotoSets } from '../lib/photoStore';

export const sensorAspect = (p: Product) => (p.kind === 'camera' && (p.sensor.size === 'Micro Four Thirds' || p.sensor.size === 'Medium Format') ? 4 / 3 : 3 / 2);

export function PhotoCredit({ id }: { id: string }) {
  const c = creditFor(id);
  if (!c) return null;
  return (
    <p className="credit">
      Photos:{' '}
      <a href={c.page} target="_blank" rel="noreferrer">
        {c.source}
      </a>
    </p>
  );
}

function Gallery({ product }: { product: Product }) {
  usePhotoSets();
  const files = photosFor(product.id);
  const [sel, setSel] = useState<number | undefined>(undefined);
  return (
    <>
      <ProductImage product={product} size="lg" index={sel} />
      {files.length > 1 && (
        <div className="thumbs">
          {files.map((f, k) => (
            <button key={f} className={(sel ?? 0) === k ? 'on' : ''} onClick={() => setSel(k)} onMouseEnter={() => setSel(k)} aria-label={`View ${k + 1}`}>
              <img referrerPolicy="no-referrer" src={f} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function FactorList({ title, factors }: { title: string; factors: Factor[] }) {
  return (
    <div className="factors">
      <h4>{title}</h4>
      {factors.map((f, i) => (
        <div key={f.label} className="factor">
          <Bar label={f.label} value={Math.round(f.score)} color={CAT_COLOR[title]} compact delay={i * 60} />
          <span className="muted small">
            {f.detail} · weight {Math.round(f.weight * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function SpecSheet({ product }: { product: Product }) {
  return (
    <div className="specsheet">
      {specFor(product).map((g, gi) => (
        <div key={g.group} className="spec-group rise" style={{ ['--i' as string]: gi }}>
          <h4>{g.group}</h4>
          <dl>
            {g.rows.map((r) => (
              <div key={r.label} className="spec-row">
                <dt>{r.label}</dt>
                <dd>{r.value(product)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export function VideoSection({ product }: { product: Filmable }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const cf = product.kind === 'camera' ? product.sensor.cropFactor : 1;
  return (
    <>
      <div className="section-head">
        <div className="seg">
          <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>
            Frame-rate grid
          </button>
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>
            Every format, one per line
          </button>
        </div>
        <div className="legend small">
          {product.kind === 'camera' ? (
            <>
              <span className="lg full">Full</span> full sensor width
              <span className="lg mild">1.1×</span> slight crop
              <span className="lg heavy">1.5×</span> heavy crop
              <span className="lg none">·</span> not available
            </>
          ) : (
            <>
              <span className="lg full">✓</span> available <span className="lg none">·</span> not available
            </>
          )}
        </div>
      </div>
      <div key={view} className="fade-in">
        {view === 'grid' ? <FrameRateMatrix product={product} /> : <FormatList product={product} sensorAspect={sensorAspect(product)} cropFactor={cf} />}
      </div>
      <p className="muted small fineprint">
        24p means 23.98 and 24.00, 30p means 29.97, 60p means 59.94 and 120p means 119.88. Hover a cell for bit depth and notes. “External recorder” rows need an
        HDMI/SDI recorder such as an Atomos.
      </p>
    </>
  );
}

type Tab = 'overview' | 'video' | 'specs';

function factsFor(product: Product): [string, string][] {
  if (product.kind === 'gimbal')
    return [
      ['Payload', product.payload < 1 ? `${Math.round(product.payload * 1000)} g` : `${product.payload} kg`],
      ['Battery', `${product.battery} h`],
      ['Weight', `${product.weight} g`],
      ['For', product.cls === 'Phone' ? 'Phones' : 'Cameras'],
      ['Tracking', /module|transmitter|tracker/i.test(product.tracking) ? 'Built-in module' : /track/i.test(product.tracking) ? 'Via app' : 'None'],
      ['Vertical', /native/i.test(product.vertical) ? 'Native' : 'Via clamp'],
    ];
  const vs = videoStats(product.video.modes);
  if (product.kind === 'camera') {
    const stab = product.stab === 'gimbal' ? '3-axis gimbal' : product.stab === 'eis' ? 'Electronic' : product.ibis ? `IBIS ${product.ibis.stops} stops` : 'none';
    return [
      ['Sensor', `${product.sensor.mp}MP ${product.sensor.size}`],
      ['Max video', `${resLabel(vs.maxWidth)}${product.video.intRaw ? ' RAW' : ''}`],
      ['4K', vs.fullWidth4k ? `up to ${vs.fullWidth4k}p uncropped` : vs.any4k ? `up to ${vs.any4k}p (cropped)` : 'none'],
      product.waterproof ? ['Waterproof', `${product.waterproof} m`] : ['Burst', product.photo.eFps ? `${Math.max(product.photo.eFps, product.photo.mechFps ?? 0)} fps` : '—'],
      ['Stabilization', stab],
      ['Weight', `${product.body.weight} g`],
    ];
  }
  return [
    ['Main camera', `${product.cameras[0].mp}MP ${product.cameras[0].sensor}`],
    ['Cameras', String(product.cameras.length)],
    ['Max video', resLabel(vs.maxWidth)],
    ['Flight time', `${product.flight.time} min`],
    ['Range', `${product.flight.rangeKm} km`],
    ['Weight', `${product.flight.weight} g`],
  ];
}

export function Detail({ product, toggleCompare, compare }: { product: Product; compare: string[]; toggleCompare: (id: string) => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [owned, setOwned] = useState('');
  const s = scoresFor(product);
  const sec = sectionOf(product);
  const peers = products.filter((p) => p.kind === product.kind && p.id !== product.id);
  const sameSection = peers.filter((p) => sectionOf(p) === sec);
  const alternatives = sameSection
    .filter((p) => Math.abs(p.price - product.price) / product.price <= 0.35 && p.year >= product.year - 2)
    .sort((a, b) => scoresFor(b).overall - scoresFor(a).overall)
    .slice(0, 4);
  const successors = sameSection.filter((p) => p.brand === product.brand && p.year > product.year && scoresFor(p).overall > s.overall + 5 && p.price <= product.price * 1.5).slice(0, 4);
  const filmable = product.kind !== 'gimbal';
  const formats = filmable ? product.video.modes.reduce((n, m) => n + m.fps.length, 0) : 0;
  const tabs: [Tab, string][] = [
    ['overview', 'Overview'],
    ...(filmable ? ([['video', `Video modes (${formats} formats)`]] as [Tab, string][]) : []),
    ['specs', 'Full spec sheet'],
  ];

  return (
    <section className="detail" style={{ ['--brand' as string]: BRAND_COLOR[product.brand] }}>
      <button className="back" onClick={() => go(`/${sec}`)}>
        ← All {sec === 'action' ? 'action & 360 cameras' : sec}
      </button>

      <div className="detail-top">
        <div className="detail-img">
          <Gallery product={product} />
          <div className="photo-tools">
            <PhotoCredit id={product.id} />
            <button className="link small" onClick={() => go(`/photos/${product.id}`)}>
              {photosFor(product.id).length ? 'Replace photos' : '📸 Add real photos'}
            </button>
          </div>
        </div>
        <div className="detail-info">
          <div className="rise" style={{ ['--i' as string]: 1 }}>
            <BrandLogo brand={product.brand} size="md" />
            <h1 className="detail-title">{product.model}</h1>
          </div>
          <div className="meta rise" style={{ ['--i' as string]: 2 }}>
            <span>{money(product.price)} at launch</span>
            <span>{product.year}</span>
            {product.kind === 'camera' && <span>{product.type}</span>}
            <span>{product.segment}</span>
            {product.kind === 'camera' && <span>{product.mount}</span>}
          </div>
          {product.verify && <div className="verify rise">Recent release — double-check specs against the manufacturer page before buying.</div>}
          <div className="score-panel rise" style={{ ['--i' as string]: 3 }}>
            <ScoreRing value={s.overall} />
            <div className="grow">
              <ScoreBars product={product} />
            </div>
          </div>
          <div className="facts">
            {factsFor(product).map(([k, v], i) => (
              <div key={k} className="fact rise" style={{ ['--i' as string]: 4 + i * 0.5 }}>
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
          <div className="upgrade-box rise" style={{ ['--i' as string]: 7 }}>
            <label>
              Thinking of upgrading from…
              <select value={owned} onChange={(e) => setOwned(e.target.value)}>
                <option value="">Pick what you own</option>
                {peers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} {p.model}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn" disabled={!owned} onClick={() => go(`/vs/${owned}/${product.id}`)}>
              Should I upgrade?
            </button>
            <button className={`btn ghost ${compare.includes(product.id) ? 'on' : ''}`} onClick={() => toggleCompare(product.id)}>
              {compare.includes(product.id) ? '✓ In comparison' : '+ Compare'}
            </button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(([t, l]) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {l}
          </button>
        ))}
      </div>

      <div key={tab} className="fade-in">
        {tab === 'overview' && (
          <>
            <div className="panel">
              <h2>At a glance</h2>
              <ul className="highlights">
                {product.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            {product.kind === 'drone' && (
              <div className="panel">
                <h2>Cameras on board</h2>
                <div className="dcams">
                  {product.cameras.map((c, i) => (
                    <div key={c.name} className="dcam rise" style={{ ['--i' as string]: i }}>
                      <div className="strong">{c.name}</div>
                      <div className="mono">{c.focal}</div>
                      <div>
                        {c.sensor} · {c.mp}MP · {c.aperture}
                      </div>
                      <div className="muted small">Video up to {c.maxVideo}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="panel">
              <h2>How it scores</h2>
              <div className="factors-grid">
                {Object.entries(s.factors).map(([t, f]) => (
                  <FactorList key={t} title={t} factors={f} />
                ))}
              </div>
            </div>
            {successors.length > 0 && (
              <div className="panel">
                <h2>Newer {product.brand} models worth upgrading to</h2>
                <div className="alts">
                  {successors.map((p, i) => (
                    <AltCard key={p.id} from={product} to={p} i={i} />
                  ))}
                </div>
              </div>
            )}
            {alternatives.length > 0 && (
              <div className="panel">
                <h2>Similar price, worth a look</h2>
                <div className="alts">
                  {alternatives.map((p, i) => (
                    <AltCard key={p.id} from={product} to={p} i={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'video' && filmable && (
          <div className="panel">
            <h2>Every video mode</h2>
            <VideoSection product={product} />
          </div>
        )}

        {tab === 'specs' && (
          <div className="panel">
            <h2>Full spec sheet</h2>
            <SpecSheet product={product} />
          </div>
        )}
      </div>
    </section>
  );
}

function AltCard({ from, to, i }: { from: Product; to: Product; i: number }) {
  const d = scoresFor(to).overall - scoresFor(from).overall;
  return (
    <button className="alt rise" style={{ ['--i' as string]: i }} onClick={() => go(`/vs/${from.id}/${to.id}`)}>
      <ProductImage product={to} size="sm" />
      <div>
        <div className="brand">{to.brand}</div>
        <div className="strong">{to.model}</div>
        <div className="muted small">
          {money(to.price)} · {to.year} · overall {scoresFor(to).overall}{' '}
          <span className={d > 0 ? 'good' : d < 0 ? 'bad' : ''}>
            ({d > 0 ? '+' : ''}
            {d})
          </span>
        </div>
        <div className="small accent">Compare →</div>
      </div>
    </button>
  );
}
