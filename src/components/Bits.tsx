import { useEffect, useRef, useState } from 'react';
import type { Filmable, Product, VideoMode } from '../data/types';
import { modeWidth, resTier, scoresFor } from '../lib/scoring';

// ── tiny hash router ─────────────────────────────────────────
export function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/home');
  useEffect(() => {
    const on = () => {
      setHash(window.location.hash.slice(1) || '/home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash.split('/').filter(Boolean);
}
type ShutterFn = (path: string, swap: () => void) => void;
let shutter: ShutterFn | null = null;
export const registerShutter = (fn: ShutterFn | null) => void (shutter = fn);

/** Navigate. Moving between sections (or opening a product) closes the shutter over the swap. */
export const go = (path: string) => {
  const cur = window.location.hash.slice(1).split('/').filter(Boolean)[0] || 'home';
  const nxt = path.split('/').filter(Boolean)[0] || 'home';
  const swap = () => void (window.location.hash = path);
  if (shutter && (cur !== nxt || nxt === 'p') && window.location.hash.slice(1) !== path) shutter(path, swap);
  else swap();
};

// ── score bars ───────────────────────────────────────────────
export const CAT_COLOR: Record<string, string> = {
  Photo: 'var(--c-photo)',
  Video: 'var(--c-video)',
  Flight: 'var(--c-flight)',
  Overall: 'var(--c-overall)',
  Payload: 'var(--c-photo)',
  Battery: 'var(--c-flight)',
  Smart: 'var(--c-video)',
  Portability: '#a78bfa',
};

export const scoreRows = (p: Product) => scoresFor(p).bars;

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Animated number that counts up to `to`. */
export function useCountUp(to: number, ms = 900) {
  const [v, setV] = useState(reduced() || (typeof document !== 'undefined' && document.hidden) ? to : 0);
  useEffect(() => {
    if (reduced() || document.hidden) return setV(to);
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setV(Math.round(from + (to - from) * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // rAF pauses in background tabs — make sure we always land on the final value
    const done = setTimeout(() => setV(to), ms + 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [to, ms]);
  return v;
}

export function CountUp({ value, ms }: { value: number; ms?: number }) {
  return <>{useCountUp(value, ms)}</>;
}

export function Bar({ label, value, color, compact, delay = 0 }: { label: string; value: number; color?: string; compact?: boolean; delay?: number }) {
  return (
    <div className={`bar ${compact ? 'bar-compact' : ''}`}>
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${value}%`, background: color ?? CAT_COLOR[label], animationDelay: `${delay}ms` }} />
      </div>
      <span className="bar-val">
        <CountUp value={value} ms={800 + delay} />
      </span>
    </div>
  );
}

export function ScoreBars({ product, compact }: { product: Product; compact?: boolean }) {
  return (
    <div className="bars">
      {scoreRows(product).map(([l, v], i) => (
        <Bar key={l} label={l} value={v} compact={compact} delay={i * 90} />
      ))}
    </div>
  );
}

export function ScoreRing({ value, size = 96, label = 'overall' }: { value: number; size?: number; label?: string }) {
  const v = useCountUp(value, 1100);
  return (
    <div className="ring" style={{ ['--v' as string]: v, width: size, height: size }}>
      <span style={{ fontSize: size * 0.31 }}>{v}</span>
      <small>{label}</small>
    </div>
  );
}

// ── frame-rate helpers ───────────────────────────────────────
export const FPS_NOTE: Record<number, string> = { 24: '23.98 / 24', 30: '29.97 / 30', 60: '59.94 / 60', 120: '119.88 / 120', 48: '47.95 / 48' };
export const fpsLabel = (f: number) => `${f}p`;

export function modeQuality(m: VideoMode) {
  if (m.raw) return `${m.bit ?? 12}-bit RAW`;
  return `${m.bit ?? 8}-bit ${m.chroma ?? ''}`.trim();
}

const cropText = (c: number) => (c <= 1.05 ? 'Full' : `${c}×`);
const cropClass = (c: number) => (c <= 1.05 ? 'full' : c < 1.4 ? 'mild' : 'heavy');

export function CropDiagram({ crop, dims, sensorAspect }: { crop: number; dims: string; sensorAspect: number }) {
  const W = 54;
  const H = W / sensorAspect;
  const [w, h] = dims.split('x').map(Number);
  const aspect = w / h;
  const iw = Math.min(W / crop, (H / crop) * aspect);
  const ih = iw / aspect;
  return (
    <svg width={W + 2} height={H + 2} viewBox={`-1 -1 ${W + 2} ${H + 2}`} className="cropdiag" aria-label={`Crop ${crop}x`}>
      <rect x="0" y="0" width={W} height={H} rx="2" className="cd-sensor" />
      <rect x={(W - iw) / 2} y={(H - ih) / 2} width={iw} height={ih} rx="1" className="cd-frame" />
    </svg>
  );
}

interface Row {
  key: string;
  label: string;
  dims: string;
  modes: VideoMode[];
}

function groupRows(modes: VideoMode[]): Row[] {
  const rows = new Map<string, Row>();
  for (const m of modes) {
    const key = `${m.dims}|${m.camera ?? ''}|${m.raw ? 'raw' : ''}|${m.ext ? 'ext' : ''}`;
    const r = rows.get(key);
    if (r) {
      r.modes.push(m);
      if (!r.label.includes(m.label) && r.label.length < 40) r.label = r.label.length <= m.label.length ? r.label : m.label;
    } else rows.set(key, { key, label: m.label, dims: m.dims, modes: [m] });
  }
  return [...rows.values()].sort((a, b) => modeWidth(b.modes[0]) - modeWidth(a.modes[0]) || (a.modes[0].ext ? 1 : 0) - (b.modes[0].ext ? 1 : 0));
}

/** Resolution × frame-rate grid. Every cell says whether that exact combo exists, and at what crop. */
export function FrameRateMatrix({ product }: { product: Filmable }) {
  const modes = product.video.modes;
  const rates = [...new Set(modes.flatMap((m) => m.fps))].sort((a, b) => a - b);
  const rows = groupRows(modes);
  const isCam = product.kind === 'camera';
  return (
    <div className="table-wrap">
      <table className="matrix">
        <thead>
          <tr>
            <th className="sticky-col">Resolution</th>
            {rates.map((r) => (
              <th key={r} title={FPS_NOTE[r] ? `${FPS_NOTE[r]} fps` : `${r} fps`}>
                {fpsLabel(r)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const first = row.modes[0];
            return (
              <tr key={row.key}>
                <th className="sticky-col row-head">
                  <div className="strong">{row.label}</div>
                  <div className="muted mono small">
                    {row.dims.replace('x', '×')}
                    {first.camera ? ` · ${first.camera}` : ''}
                  </div>
                  <div className="row-tags">
                    <span className={`q ${first.raw ? 'q-raw' : (first.bit ?? 8) >= 10 ? 'q-10' : 'q-8'}`}>{modeQuality(first)}</span>
                    {first.ext && <span className="q q-ext">External recorder</span>}
                  </div>
                </th>
                {rates.map((r, ci) => {
                  const hits = row.modes.filter((m) => m.fps.includes(r));
                  if (!hits.length) return <td key={r} className="cell none" aria-label="Not available">·</td>;
                  const best = hits.reduce((a, b) => ((a.crop ?? 1) <= (b.crop ?? 1) ? a : b));
                  const c = best.crop ?? 1;
                  const tip = `${row.label} ${fpsLabel(r)} — ${isCam ? (c <= 1.05 ? 'full sensor width' : `${c}× crop`) : best.camera} · ${modeQuality(best)}${best.note ? ` · ${best.note}` : ''}`;
                  return (
                    <td key={r} className={`cell pop ${isCam ? cropClass(c) : 'full'} ${best.ext ? 'ext' : ''}`} style={{ animationDelay: `${ci * 35}ms` }} title={tip}>
                      {isCam ? cropText(c) : '✓'}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Flat list: one line per resolution × frame rate. */
export function FormatList({ product, sensorAspect, cropFactor }: { product: Filmable; sensorAspect: number; cropFactor: number }) {
  const lines = product.video.modes
    .flatMap((m) => m.fps.map((f) => ({ m, f })))
    .sort((a, b) => modeWidth(b.m) - modeWidth(a.m) || a.f - b.f || (a.m.crop ?? 1) - (b.m.crop ?? 1));
  const isCam = product.kind === 'camera';
  return (
    <div className="table-wrap">
      <table className="modes">
        <thead>
          <tr>
            <th>Format</th>
            <th>Resolution</th>
            <th>Frame rate</th>
            {isCam ? <th>Crop</th> : <th>Camera</th>}
            {isCam && <th>FF-equiv.</th>}
            <th>Quality</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {lines.map(({ m, f }, i) => {
            const crop = m.crop ?? 1;
            return (
              <tr key={i}>
                <td className="strong">
                  {m.label}
                  <span className="tier">{resTier(m)}</span>
                </td>
                <td className="mono">{m.dims.replace('x', ' × ')}</td>
                <td className="mono">
                  <b>{fpsLabel(f)}</b>
                  {FPS_NOTE[f] && <span className="muted small"> ({FPS_NOTE[f]})</span>}
                </td>
                {isCam ? (
                  <td>
                    <div className="crop-cell">
                      <CropDiagram crop={crop} dims={m.dims} sensorAspect={sensorAspect} />
                      <span className={crop <= 1.05 ? 'good' : crop >= 1.4 ? 'bad' : 'warn'}>{crop <= 1.05 ? 'Full width' : `${crop}×`}</span>
                    </div>
                  </td>
                ) : (
                  <td>{m.camera}</td>
                )}
                {isCam && <td className="mono">{(cropFactor * crop).toFixed(2)}×</td>}
                <td>
                  <span className={`q ${m.raw ? 'q-raw' : (m.bit ?? 8) >= 10 ? 'q-10' : 'q-8'}`}>{modeQuality(m)}</span>
                  {m.ext && <span className="q q-ext">External</span>}
                </td>
                <td className="muted small">{m.note ?? ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── side-by-side matrix for Versus ───────────────────────────
const TIERS = ['8K', '5K-6K', '4K', 'FHD'] as const;
const TIER_LABEL: Record<string, string> = { '8K': '8K', '5K-6K': '5K – 7K', '4K': '4K', FHD: '1080p' };

function bestAt(p: Filmable, tier: string, fps: number) {
  let best: number | null = null;
  for (const m of p.video.modes) {
    if (m.ext || resTier(m) !== tier || !m.fps.includes(fps)) continue;
    const c = m.crop ?? 1;
    if (best == null || c < best) best = c;
  }
  return best;
}

export const SIDES = ['a', 'b', 'c', 'd'] as const;

export function DuelMatrix({ items }: { items: Filmable[] }) {
  const rates = [...new Set(items.flatMap((p) => p.video.modes).filter((m) => !m.ext).flatMap((m) => m.fps))].sort((x, y) => x - y);
  const tiers = TIERS.filter((t) => items.some((p) => p.video.modes.some((m) => !m.ext && resTier(m) === t)));
  const cell = (p: Filmable, t: string, r: number) => {
    const c = bestAt(p, t, r);
    if (c == null) return <span className="dm-dot no">–</span>;
    return <span className={`dm-dot ${p.kind === 'drone' ? 'full' : cropClass(c)}`}>{p.kind === 'drone' ? '✓' : cropText(c)}</span>;
  };
  return (
    <div className="table-wrap">
      <table className="matrix duel-matrix">
        <thead>
          <tr>
            <th className="sticky-col">Resolution</th>
            {rates.map((r) => (
              <th key={r}>{fpsLabel(r)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tiers.map((t) => (
            <tr key={t}>
              <th className="sticky-col row-head">
                <div className="strong">{TIER_LABEL[t]}</div>
                <div className="dm-legend">
                  {items.map((_, i) => (
                    <span key={i}>
                      {i > 0 && ' / '}
                      <span className={`${SIDES[i]}-text`}>{SIDES[i].toUpperCase()}</span>
                    </span>
                  ))}
                </div>
              </th>
              {rates.map((r) => (
                <td key={r} className="dm-cell">
                  {items.map((p, i) => (
                    <div key={p.id} className={`dm-${SIDES[i]}`}>
                      {cell(p, t, r)}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
