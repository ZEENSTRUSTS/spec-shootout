import { Fragment, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { exportJpeg, exportPdf } from '../lib/exporter';
import { VsReport } from './VsReport';
import { rankWithReasons } from '../lib/ranking';
import { byId, products } from '../data';
import type { Filmable, Product } from '../data/types';
import { scoresFor } from '../lib/scoring';
import { money, specFor } from '../lib/specRows';
import { verdict, type Priority } from '../lib/verdict';
import { CountUp, DuelMatrix, go, ScoreRoll, scoreRows, SIDES } from './Bits';
import { BrandLogo } from './BrandLogo';
import { VideoSection } from './Detail';
import { ProductImage } from './ProductImage';
import { Picker } from './Picker';

const SLOT_NOUN: Record<Product['kind'], string> = { camera: 'Camera', drone: 'Drone', gimbal: 'Gimbal' };
const slotLabel = (i: number, kind?: Product['kind']) => `${kind ? SLOT_NOUN[kind] : 'Device'} ${i + 1}`;

/** Builds a /vs route from up to four slots, dropping empty trailing ones. */
const vsRoute = (ids: (string | undefined)[]) => {
  const parts = ids.slice(0, 4).map((x) => x || '_');
  while (parts.length > 2 && parts[parts.length - 1] === '_') parts.pop();
  return `/vs/${parts.join('/')}`;
};

const lastFilled = (slots: (Product | undefined)[]) => {
  let n = 0;
  slots.forEach((p, i) => p && (n = i + 1));
  return n;
};

export function Versus({ slots }: { slots: (Product | undefined)[] }) {
  const [priority, setPriority] = useState<Priority>('hybrid');
  const [extra, setExtra] = useState(2);
  const kind = slots.find(Boolean)?.kind;
  const ids = [0, 1, 2, 3].map((i) => slots[i]?.id);
  const shown = Math.min(4, Math.max(extra, lastFilled(slots), 2));

  const setSlot = (i: number, id: string) => {
    const next = [...ids];
    next[i] = id || undefined;
    const k = id ? byId(id)?.kind : undefined;
    // switching to a different type of product clears slots that no longer match
    if (k) next.forEach((x, j) => j !== i && x && byId(x)?.kind !== k && (next[j] = undefined));
    if (!id && i >= 2) {
      next.splice(i, 1);
      setExtra((e) => Math.max(2, e - 1));
    }
    go(vsRoute(next));
  };
  const swap = () => ids[0] && ids[1] && go(vsRoute([ids[1], ids[0]]));

  const items = slots.slice(0, shown).filter((p): p is Product => !!p);
  const a = slots[0];
  const b = slots[1];
  const ready = items.length >= 2;
  const duo = ready && items.length === 2 && !!a && !!b;
  const v = duo ? verdict(a!, b!, priority) : null;
  const priorities: [Priority, string][] =
    kind === 'gimbal'
      ? [['hybrid', 'All-round']]
      : kind === 'drone'
      ? [
          ['hybrid', 'All-round'],
          ['photo', 'Photos'],
          ['video', 'Video'],
          ['flight', 'Flying'],
        ]
      : [
          ['hybrid', 'Hybrid'],
          ['photo', 'Mostly photo'],
          ['video', 'Mostly video'],
        ];
  const side = (p: Product) => SIDES[slots.indexOf(p)];
  const filmable = items.every((p) => p.kind !== 'gimbal');

  return (
    <section>
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-text">
          <span className="eyebrow">Upgrade advisor</span>
          <h1>
            Head to head. <span className="grad">Upgrade or skip?</span>
          </h1>
          <p className="muted">
            Pick up to four to compare side by side. With two, you get a straight answer on moving from the first to the second: upgrade, sidegrade or skip. With three or four, a
            ranking that explains why each one lands where it does.
          </p>
        </div>
      </div>

      <div className={`vs-pick n${shown}`}>
        {Array.from({ length: shown }, (_, i) => (
          <div key={i} className="vs-side">
            <span className={`side-label ${SIDES[i]}`}>{slotLabel(i, kind)}</span>
            <Picker value={ids[i]} kind={kind} onChange={(id) => setSlot(i, id)} exclude={ids.filter((x): x is string => !!x)} />
          </div>
        ))}
        <div className="vs-tools">
          {shown === 2 && (
            <button className="swap" onClick={swap} disabled={!duo} title="Swap sides">
              ⇄
            </button>
          )}
          {shown < 4 && (
            <button className="btn ghost sm" onClick={() => setExtra(shown + 1)}>
              + Add device
            </button>
          )}
        </div>
      </div>

      {!ready && <p className="muted center">Pick at least two {kind ? `${kind}s` : 'products of the same type'} to compare.</p>}

      {ready && (
        <>
          <div className={`vs-hero n${items.length}`}>
            {items.map((p, i) => (
              <Fragment key={p.id}>
                {duo && i === 1 && (
                  <div className="vs-badge">
                    <span>VS</span>
                  </div>
                )}
                <button className={`vs-card side-${side(p)}`} onClick={() => go(`/p/${p.id}`)}>
                  <ProductImage product={p} />
                  <BrandLogo brand={p.brand} size="sm" />
                  <h2>{p.model}</h2>
                  <div className="muted">
                    {money(p.price)} · {p.year}
                  </div>
                </button>
              </Fragment>
            ))}
          </div>

          <div className="priority">
            <span className="muted">I mainly use it for:</span>
            {priorities.map(([k, l]) => (
              <button key={k} className={`chip ${priority === k ? 'on' : ''}`} onClick={() => setPriority(k)}>
                {l}
              </button>
            ))}
          </div>

          <ExportBar items={items} priority={priority} />

          {v && <VerdictPanel key={`${a!.id}-${b!.id}-${priority}`} v={v} />}
          {!duo && <Ranking items={items} priority={priority} side={side} />}

          <div className="panel">
            <h2>Scores</h2>
            {duo ? (
              <div className="duel">
                {scoreRows(a!).map(([label, va], i) => {
                  const vb = scoreRows(b!)[i][1];
                  return (
                    <div key={label} className="duel-row">
                      <div className="duel-bar left">
                        <span className={`dv ${va > vb ? 'win' : ''}`}>{va}</span>
                        <div className="dtrack">
                          <div className="dfill a" style={{ width: `${va}%` }} />
                        </div>
                      </div>
                      <div className="duel-label">{label}</div>
                      <div className="duel-bar">
                        <div className="dtrack">
                          <div className="dfill b" style={{ width: `${vb}%` }} />
                        </div>
                        <span className={`dv ${vb > va ? 'win' : ''}`}>{vb}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="multi-scores">
                {scoreRows(items[0]).map(([label], r) => {
                  const vals = items.map((p) => scoreRows(p)[r]?.[1] ?? 0);
                  const top = Math.max(...vals);
                  const unique = vals.filter((x) => x === top).length === 1;
                  return (
                    <div key={label} className="ms-group">
                      <div className="ms-label">{label}</div>
                      {items.map((p, i) => (
                        <div key={p.id} className="ms-row">
                          <span className={`ms-name ${side(p)}-text`}>{p.model}</span>
                          <div className="dtrack">
                            <div className={`dfill ${side(p)}`} style={{ width: `${vals[i]}%` }} />
                          </div>
                          <span className={`dv ${unique && vals[i] === top ? 'win' : ''}`}>{vals[i]}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="panel">
            <h2>Spec by spec</h2>
            <div className="table-wrap">
              <table className={`vs-table n${items.length}`}>
                <thead>
                  <tr>
                    <th />
                    {items.map((p) => (
                      <th key={p.id} className={side(p)}>
                        {p.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                {specFor(items[0]).map((g) => (
                  <tbody key={g.group}>
                    <tr className="group-row">
                      <th colSpan={items.length + 1}>{g.group}</th>
                    </tr>
                    {g.rows.map((r) => {
                      const nums = items.map((p) => (r.num && r.better ? r.num(p) : null));
                      const valid = nums.filter((n): n is number => n != null);
                      let best: number | null = null;
                      if (valid.length === items.length && new Set(valid).size > 1) {
                        const target = r.better === 'high' ? Math.max(...valid) : Math.min(...valid);
                        if (valid.filter((n) => n === target).length === 1) best = target;
                      }
                      return (
                        <tr key={r.label}>
                          <td className="muted">{r.label}</td>
                          {items.map((p, i) => (
                            <td key={p.id} className={best != null && nums[i] === best ? 'win' : ''}>
                              {r.value(p)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                ))}
              </table>
            </div>
          </div>

          {filmable && (
            <>
              <div className="panel">
                <h2>Frame-rate face-off</h2>
                <p className="muted small">
                  Each cell shows, top to bottom,{' '}
                  {items.map((p, i) => (
                    <span key={p.id}>
                      {i > 0 && (i === items.length - 1 ? ' and ' : ', ')}
                      <span className={`${side(p)}-text strong`}>{p.model}</span>
                    </span>
                  ))}
                  : whether it can record that resolution at that frame rate internally, and the crop if there is one.
                </p>
                <DuelMatrix items={items as Filmable[]} />
              </div>

              <div className="panel">
                <h2>Every video mode</h2>
                <div className="vs-modes">
                  {items.map((p) => (
                    <div key={p.id}>
                      <h4 className={`${side(p)}-text`}>{p.model}</h4>
                      <VideoSection product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {!items.length && <Suggestions />}
    </section>
  );
}

/** Download the whole comparison as a PDF (A4, paginated by section) or one tall JPEG. */
function ExportBar({ items, priority }: { items: Product[]; priority: Priority }) {
  const [job, setJob] = useState<'pdf' | 'jpg' | null>(null);
  const [err, setErr] = useState('');
  const sheet = useRef<HTMLDivElement>(null);
  const name = `spec-shootout-${items.map((p) => p.id).join('-vs-')}`.slice(0, 120);

  const ready = useCallback(async () => {
    if (!sheet.current || !job) return;
    try {
      await (job === 'pdf' ? exportPdf(sheet.current, name) : exportJpeg(sheet.current, name));
      setErr('');
    } catch (e) {
      console.error(e);
      setErr('Export failed — please try again.');
    } finally {
      setJob(null);
    }
  }, [job, name]);

  return (
    <div className="vs-export">
      <span className="grow">
        <b>Save this comparison</b>
        Products, verdict, scores, every spec and the frame-rate table.
      </span>
      {err && <span className="bad small">{err}</span>}
      <button className="btn" disabled={!!job} onClick={() => setJob('pdf')}>
        {job === 'pdf' ? 'Preparing PDF…' : '⬇ PDF'}
      </button>
      <button className="btn ghost" disabled={!!job} onClick={() => setJob('jpg')}>
        {job === 'jpg' ? 'Preparing image…' : '⬇ JPEG'}
      </button>
      {job &&
        createPortal(
          <div className="rp-stage" aria-hidden>
            <VsReport ref={sheet} items={items} priority={priority} onReady={ready} />
          </div>,
          document.body,
        )}
    </div>
  );
}

function VerdictPanel({ v }: { v: ReturnType<typeof verdict> }) {
  return (
    <div className={`verdict v-${v.level}`}>
      <div className="verdict-head">
        <div className="delta">
          {v.delta > 0 ? '+' : v.delta < 0 ? '−' : ''}
          <CountUp value={Math.abs(v.delta)} />
        </div>
        <div>
          <h2>{v.title}</h2>
          <p>{v.summary}</p>
        </div>
      </div>
      <div className="gl">
        <div>
          <h4>What you gain</h4>
          {v.gains.length ? (
            <ul className="gains">
              {v.gains.map((g, i) => (
                <li key={g.text} className="rise" style={{ ['--i' as string]: i }}>
                  {g.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">Nothing significant.</p>
          )}
        </div>
        <div>
          <h4>What you give up</h4>
          {v.losses.length ? (
            <ul className="losses">
              {v.losses.map((g, i) => (
                <li key={g.text} className="rise" style={{ ['--i' as string]: i }}>
                  {g.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">Nothing — it’s better or equal everywhere we measure.</p>
          )}
        </div>
      </div>
      {v.notes.length > 0 && (
        <ul className="notes">
          {v.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 3–4 products: rank them and explain each position. */
function Ranking({ items, priority, side }: { items: Product[]; priority: Priority; side: (p: Product) => string }) {
  const ranked = rankWithReasons(items, priority);
  return (
    <div className="panel ranking">
      <h2>Ranking</h2>
      <ol className="rank-list">
        {ranked.map((r) => (
          <li key={r.p.id} className={`rank-row side-${side(r.p)}`}>
            <span className="rank-n">{r.rank}</span>
            <div className="rank-main">
              <b className={`${side(r.p)}-text`}>{r.p.model}</b>
              <span className="muted small">
                {' '}
                · {money(r.p.price)} · {r.p.year}
              </span>
              <div className="rank-why">
                <p className={r.rank === 1 ? 'rank-head first' : 'rank-head'}>{r.rank === 1 ? `Why it’s #1: ${r.headline}` : r.headline}</p>
                {r.why.length > 0 && (
                  <p>
                    <span className="rank-tag">{r.rank === 1 ? 'Beats the rest on' : `Where #1 is better`}</span>
                    {r.why.join(' · ')}
                  </p>
                )}
                {r.edge.length > 0 && (
                  <p>
                    <span className="rank-tag good">Beats #1 on</span>
                    {r.edge.join(' · ')}
                  </p>
                )}
              </div>
            </div>
            <span className="rank-score">
              <ScoreRoll value={r.score} delay={0.15 * (r.rank - 1)} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Suggestions() {
  const pairs: [string, string][] = [
    ['canon-60d', 'canon-90d'],
    ['canon-5diii', 'canon-r6ii'],
    ['canon-80d', 'canon-r7'],
    ['canon-c100ii', 'canon-c70'],
    ['sony-a6000', 'sony-a6400'],
    ['sony-rx100iii', 'sony-zv1'],
    ['nikon-d750', 'nikon-z6iii'],
    ['nikon-d7200', 'nikon-z50ii'],
    ['nikon-d850', 'nikon-z8'],
    ['fujifilm-xt3', 'fujifilm-xt5'],
    ['panasonic-gh5', 'panasonic-gh7'],
    ['dji-mavic-2-pro', 'dji-air-3s'],
    ['dji-mini-2', 'dji-mini-4-pro'],
    ['dji-pocket-2', 'dji-osmo-pocket-3'],
    ['gopro-hero12', 'dji-osmo-action-5-pro'],
    ['insta360-x4', 'insta360-x5'],
    ['dji-rs-3-mini', 'dji-rs-4-mini'],
    ['zhiyun-weebill-3s', 'dji-rs-4'],
    ['dji-osmo-mobile-6', 'dji-osmo-mobile-7p'],
    ['sony-a7iii', 'sony-a7iv'],
    ['sony-a7iv', 'sony-a7v'],
    ['sony-a6400', 'sony-a6700'],
    ['canon-r6', 'canon-r6ii'],
    ['canon-r6ii', 'canon-r6iii'],
    ['canon-r5', 'canon-r5ii'],
    ['nikon-z6ii', 'nikon-z6iii'],
    ['nikon-z7ii', 'nikon-z8'],
    ['fujifilm-xt4', 'fujifilm-xt5'],
    ['fujifilm-x100v', 'fujifilm-x100vi'],
    ['panasonic-s5', 'panasonic-s5iix'],
    ['panasonic-gh6', 'panasonic-gh7'],
    ['sony-a7iv', 'canon-r6iii'],
    ['dji-mini-3-pro', 'dji-mini-4-pro'],
    ['dji-mini-4-pro', 'dji-mini-5-pro'],
    ['dji-air-3', 'dji-air-3s'],
    ['dji-air-3s', 'dji-mavic-4-pro'],
    ['dji-mavic-3-pro', 'dji-mavic-4-pro'],
  ];
  const name = (id: string) => products.find((p) => p.id === id)?.model ?? id;
  return (
    <div className="panel">
      <h2>Popular matchups</h2>
      <div className="pairs">
        {pairs.map(([x, y]) => (
          <button key={x + y} className="pair" onClick={() => go(`/vs/${x}/${y}`)}>
            {name(x)} <span className="muted">vs</span> {name(y)}
            <small className="muted">
              {scoresFor(products.find((p) => p.id === x)!).overall} → {scoresFor(products.find((p) => p.id === y)!).overall}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}
