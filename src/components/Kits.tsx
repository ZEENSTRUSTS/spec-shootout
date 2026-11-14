import { useEffect } from 'react';
import { byId } from '../data';
import { kitFor, tierLabel, TIERS, TRACKS, type Kit, type KitOption, type KitSlot, type TierKey, type Track } from '../data/kits';
import { money } from '../lib/specRows';
import { go } from './Bits';
import { ProductImage } from './ProductImage';

const priceOf = (o: KitOption) => ('id' in o ? o.used ?? byId(o.id)?.price ?? 0 : o.price);

/** Lowest and highest total for a kit (required slots only). */
export function kitBudget(k: Kit): [number, number] {
  let lo = 0;
  let hi = 0;
  for (const s of k.slots) {
    if (s.optional) continue;
    const ps = s.options.map(priceOf);
    if (s.pick === 'one') {
      lo += Math.min(...ps);
      hi += Math.max(...ps);
    } else {
      const sum = ps.reduce((a, b) => a + b, 0);
      lo += sum;
      hi += sum;
    }
  }
  return [lo, hi];
}

/** Last budget shown, so switching level counts from the previous figure to the new one. */
let lastBudget: [number, number] = [0, 0];

const range = ([lo, hi]: [number, number]) => (lo === hi ? `≈ ${money(lo)}` : `${money(lo)} – ${money(hi)}`);

export function Kits({ track: t, tier: r }: { track?: string; tier?: string }) {
  const track = (TRACKS.some((x) => x.key === t) ? t : 'photo') as Track;
  const tier = (TIERS.some((x) => x.key === r) ? r : 'beginner') as TierKey;
  const kit = kitFor(track, tier);
  const budget = kitBudget(kit);
  useEffect(() => {
    lastBudget = budget;
  });
  const products = kit.slots[0].options.filter((o): o is { id: string } => 'id' in o && !!byId(o.id));

  return (
    <section className="kits">
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-text">
          <span className="eyebrow">Gear paths</span>
          <h1>
            What to buy, <span className="grad">tier by tier.</span>
          </h1>
          <p className="muted">Complete kits from your very first camera or drone up to world-class rigs. Pick your path, then your level.</p>
        </div>
      </div>

      <div className="kit-tracks">
        {TRACKS.map((x) => (
          <button key={x.key} className={`kit-track ${x.key === track ? 'on' : ''}`} onClick={() => go(`/kits/${x.key}/${tier}`)}>
            <span className="kt-icon" aria-hidden>
              {x.icon}
            </span>
            <b>{x.label}</b>
            <span className="muted small">{x.blurb}</span>
          </button>
        ))}
      </div>

      <ol className="kit-tiers">
        {TIERS.map((x, i) => {
          const b = kitBudget(kitFor(track, x.key));
          return (
            <li key={x.key}>
              <button className={x.key === tier ? 'on' : ''} onClick={() => go(`/kits/${track}/${x.key}`)}>
                <span className="kt-top">
                  <span className="kt-icon" aria-hidden>
                    {x.icon}
                  </span>
                  <span className="kt-n">Level {i + 1}</span>
                </span>
                <span className="kt-label">{tierLabel(x.key, track)}</span>
                <span className="kt-tag">{x.tag}</span>
                <span className="kt-price">from {money(b[0])}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="panel kit-head">
        <div>
          <span className="eyebrow">
            <span className="kh-icon" aria-hidden>
              {TIERS.find((x) => x.key === tier)!.icon}
            </span>{' '}
            {TRACKS.find((x) => x.key === track)!.label} · {tierLabel(tier, track)}
          </span>
          <h2>{kit.who}</h2>
          <p className="muted">{kit.goal}</p>
        </div>
        <div className="kit-budget">
          <span className="muted small">Kit budget</span>
          <b aria-label={range(budget)}>
            {budget[0] === budget[1] ? '≈ ' : ''}
            <span data-count={budget[0]} data-from={lastBudget[0]} data-format="money">
              {money(budget[0])}
            </span>
            {budget[0] !== budget[1] && (
              <>
                {' – '}
                <span data-count={budget[1]} data-from={lastBudget[1]} data-format="money">
                  {money(budget[1])}
                </span>
              </>
            )}
          </b>
          <span className="muted small">approx. US prices (used where marked), optional items excluded</span>
        </div>
      </div>

      <div className="kit-slots">
        {kit.slots.map((s) => (
          <Slot key={s.role} s={s} />
        ))}
      </div>

      <div className="panel kit-tips">
        <h3>Tips for this level</h3>
        <ul>
          {kit.tips.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {products.length >= 2 && (
          <button className="btn" onClick={() => go(`/vs/${products.slice(0, 4).map((p) => p.id).join('/')}`)}>
            Compare these {track === 'drone' ? 'drones' : 'cameras'} in Versus →
          </button>
        )}
      </div>
    </section>
  );
}

function Slot({ s }: { s: KitSlot }) {
  return (
    <div className="panel kit-slot">
      <div className="ks-head">
        <h3>{s.role}</h3>
        <span className={`ks-pick ${s.optional ? 'opt' : s.pick}`}>{s.optional ? 'Optional' : s.pick === 'one' ? 'Choose one' : s.options.length > 1 ? 'Get all' : 'Get this'}</span>
      </div>
      {s.note && <p className="muted small">{s.note}</p>}
      <div className="ks-options">
        {s.options.map((o, i) =>
          'id' in o ? (
            <ProductOption key={o.id} id={o.id} why={o.why} used={o.used} />
          ) : (
            <div key={i} className="ks-item">
              <div>
                <b>{o.name}</b>
                {o.detail && <div className="muted small">{o.detail}</div>}
              </div>
              <span className="ks-price">{o.price ? `≈ ${money(o.price)}` : 'Free'}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ProductOption({ id, why, used }: { id: string; why?: string; used?: number }) {
  const p = byId(id);
  if (!p) return null;
  return (
    <button className="ks-product" onClick={() => go(`/p/${p.id}`)}>
      <ProductImage product={p} size="sm" />
      <div className="ks-pmain">
        <span className="muted small">{p.brand}</span>
        <b>
          {p.model} <span className="muted small">· {p.year}</span>
        </b>
        {why && <span className="muted small">{why}</span>}
      </div>
      <span className="ks-price">
        {used ? (
          <>
            <span className="ks-used">used</span> ≈ {money(used)}
            <small className="muted">new was {money(p.price)}</small>
          </>
        ) : (
          money(p.price)
        )}
      </span>
    </button>
  );
}
